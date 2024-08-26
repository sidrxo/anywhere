require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT;
const IMG_URL = 'https://api.imgbb.com/1/upload';
const IMG_API_KEY = process.env.IMG_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const VISION_API_KEY = process.env.AZURE_VISION_API_KEY;
const VISION_ENDPOINT = process.env.AZURE_VISION_ENDPOINT;
const { analyzeImage } = require('./visionService'); // Import analyzeImage functionconst app = express();


// MongoDB connection
mongoose.connect(MONGODB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define the image schema with a unique identifier field
const imageSchema = new mongoose.Schema({
  identifier: { type: String, unique: true },
  url: String,
  description: String,
  tags: [String], // Store the tags as an array of strings
  uploadDate: { type: Date, default: Date.now }, // Automatically set to the current date
  user_uuid: { type: String, required: true } // New field to store user_uuid

});

// Model for the images
const Image = mongoose.model('Image', imageSchema);

// Middleware

const allowedOrigins = [
  'http://localhost:5001', // Add your local development origin
  'https://anywhere-1-1ud7.onrender.com', // Add your production origin
  'https://chroma.bar', // Add your production origin

];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests from allowed origins and no origin (e.g., Postman)
      callback(null, true);
    } else {
      // Reject requests from unknown origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers)
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Multer setup for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to generate a unique 5-digit alphanumeric code
const generateUniqueIdentifier = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let identifier;
  let isUnique = false;

  while (!isUnique) {
    identifier = '';
    for (let i = 0; i < 5; i++) {
      identifier += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if the identifier is unique by querying the database
    const existingImage = await Image.findOne({ identifier });
    if (!existingImage) {
      isUnique = true;
    }
  }

  return identifier;
};

// Function to fetch image tags using Azure Computer Vision API
const fetchImageTags = async (imageUrl) => {
  const requestBody = { url: imageUrl };

  try {
    const response = await axios.post(`${VISION_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags`, requestBody, {
      headers: {
        'Ocp-Apim-Subscription-Key': VISION_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // The response should contain the tags
  } catch (error) {
    console.error('Error fetching image tags:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch image tags');
  }
};

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  // Extract the user_uuid from cookies
  const user_uuid = req.cookies.user_uuid;
  if (!user_uuid) {
    return res.status(401).send('User not authenticated.');
  }

  try {
    const form = new FormData();
    form.append('image', req.file.buffer, { filename: req.file.originalname });
    form.append('key', IMG_API_KEY);

    const response = await axios.post(IMG_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const { data } = response;

    if (!data || !data.data || !data.data.url) {
      throw new Error('ImgBB response does not contain expected data');
    }

    const imgURL = data.data.url;
    const identifier = await generateUniqueIdentifier();
    const tags = await analyzeImage(imgURL);

    const newImage = new Image({
      identifier,
      url: imgURL,
      description: req.body.description || '',
      tags: tags.map(tag => tag.name), 
      user_uuid, // Store the user_uuid with the image
      uploadDate: new Date()
    });

    await newImage.save();

    res.status(200).json({ identifier, url: imgURL });
  } catch (error) {
    console.error('Error during image upload:', error.message);
    res.status(500).send('Error uploading image.');
  }
});





// Route to handle multiple image uploads
app.post('/upload-multiple', upload.array('images'), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).send('No files uploaded.');

  try {
    const imageUrls = [];
    const identifiers = [];

    for (const file of req.files) {
      const form = new FormData();
      form.append('image', file.buffer, { filename: file.originalname });
      form.append('key', IMG_API_KEY);

      const response = await axios.post(IMG_URL, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const { data } = response;
      if (!data || !data.data || !data.data.url) {
        throw new Error('ImgBB response does not contain expected data');
      }

      const imgURL = data.data.url;
      const identifier = await generateUniqueIdentifier();

      // Get tags from Computer Vision API
      const visionResponse = await fetchImageTags(imgURL);
      const tags = visionResponse.tags.map(tag => tag.name);

      const newImage = new Image({
        identifier,
        url: imgURL,
        description: '', 
        tags, // Save the tags array in the MongoDB document
      });

      await newImage.save();
      imageUrls.push({ identifier, url: imgURL, tags });
      identifiers.push(identifier);
    }

  } catch (error) {
    console.error('Error during multiple image upload:', error.response ? error.response.data : error.message);
    res.status(500).send('Error uploading images.');
  }
});

// Route to fetch all images
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Error fetching images.');
  }
});

app.get('/images/user', async (req, res) => {
  const userUuid = req.query.user_uuid; // Read user_uuid from query parameters

  if (!userUuid) {
    return res.status(400).send('User UUID is required.');
  }

  try {
    const images = await Image.find({ userUuid }); // Find images by userUuid
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).send('Error fetching images.');
  }
});

// Route to get an image by identifier
app.get('/image/:identifier', async (req, res) => {
  try {
    const image = await Image.findOne({ identifier: req.params.identifier });
    if (!image) {
      return res.status(404).send('Image not found.');
    }
    res.status(200).json(image);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    res.status(500).send('Error fetching image.');
  }
});

// Route to delete an image by identifier
app.delete('/image/:identifier', async (req, res) => {
  try {
    const result = await Image.deleteOne({ identifier: req.params.identifier });
    if (result.deletedCount === 0) {
      return res.status(404).send('Image not found.');
    }
    res.status(200).send('Image deleted successfully.');
  } catch (error) {
    console.error('Error deleting image:', error.message);
    res.status(500).send('Error deleting image.');
  }
});

// Route to search images by description
app.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).send('Search query cannot be empty.');
  }

  try {
    const images = await Image.find({
      description: { $regex: q, $options: 'i' }, // Case-insensitive search
    });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error searching images:', error.message);
    res.status(500).send('Error searching images.');
  }
});

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:7001', // Target the port where login-server.js is running
  changeOrigin: true,
}));


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
