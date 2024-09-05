require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
const crypto = require('crypto'); // To create a deterministic shuffle
const seedrandom = require('seedrandom'); // Import the seedrandom library
const sharp = require('sharp');



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
  colors: [String], // Store dominant colors as an array of strings
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
    const response = await axios.post(`${VISION_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags,Color`, requestBody, {
      headers: {
        'Ocp-Apim-Subscription-Key': VISION_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const { tags, color } = response.data;
    return { tags, color }; // Return both tags and color information
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
    const { tags, color } = await fetchImageTags(imgURL);

    const newImage = new Image({
      identifier,
      url: imgURL,
      description: req.body.description || '',
      tags: tags.map(tag => tag.name), 
      colors: color.dominantColors, // Save dominant colors
      user_uuid,
      uploadDate: new Date()
    });

    await newImage.save();

    res.status(200).json({ identifier, url: imgURL });
  } catch (error) {
    console.error('Error during image upload:', error.message);
    res.status(500).send('Error uploading image.');
  }
});




// Add this route to your existing Express routes

// Route to fetch a random image
app.get('/random-image', async (req, res) => {
  try {
    // Find all images
    const images = await Image.find();
    
    if (images.length === 0) {
      return res.status(404).send('No images available.');
    }

    // Pick a random image
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    
    res.status(200).json(randomImage);
  } catch (error) {
    console.error('Error fetching random image:', error.message);
    res.status(500).send('Error fetching random image.');
  }
});

// Function to compress an image
const compressImage = async (buffer) => {
  return await sharp(buffer)
    .resize({ 
      width: 1920, // Resize the image to a maximum width (optional)
      height: 1080,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 }) // Compress to 80% quality
    .toBuffer();
};


// Route to handle multiple image uploads
app.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // Extract the user_uuid from cookies
  const user_uuid = req.cookies.user_uuid;
  if (!user_uuid) {
    return res.status(401).send('User not authenticated.');
  }

  try {
    const uploadedImages = [];

    for (const file of req.files) {
      // Compress the image
      const compressedImage = await compressImage(file.buffer);

      const form = new FormData();
      form.append('image', compressedImage, { filename: file.originalname });
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

      // Get tags from Azure Computer Vision API
      const tags = await analyzeImage(imgURL);

      // Create a new Image document in MongoDB
      const newImage = new Image({
        identifier,
        url: imgURL,
        description: '', // Optional description
        tags: tags.map(tag => tag.name), // Save tags
        user_uuid, // Save user_uuid
        uploadDate: new Date(), // Save upload date
      });

      await newImage.save();
      uploadedImages.push({ identifier, url: imgURL, tags });
    }

    // Respond with all the uploaded image data
    res.status(200).json(uploadedImages);
  } catch (error) {
    console.error('Error during multiple image upload:', error.message);
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

// Route to fetch all images for the authenticated user
app.get('/imageuuid', async (req, res) => {
  // Extract the user_uuid from cookies
  const user_uuid = req.cookies.user_uuid;
  if (!user_uuid) {
    return res.status(401).send('User not authenticated.');
  }

  try {
    // Find images that belong to the user
    const images = await Image.find({ user_uuid });
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


// Helper function to shuffle array with a seed
function shuffleArray(array, seed) {
  const rng = seedrandom(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Route to fetch a consistent random set of images based on the daily seed
app.get('/daily-images', async (req, res) => {
  try {
    const images = await Image.find();

    if (images.length === 0) {
      return res.status(404).send('No images available.');
    }

    // Generate a seed based on the current date (e.g., 'YYYY-MM-DD')
    const today = new Date().toISOString().split('T')[0];
    const seed = crypto.createHash('md5').update(today).digest('hex');

    // Shuffle images using the daily seed
    const shuffledImages = shuffleArray(images, seed).slice(0, 80); // Adjust the number of images as needed

    res.status(200).json(shuffledImages);
  } catch (error) {
    console.error('Error fetching daily images:', error.message);
    res.status(500).send('Error fetching daily images.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
