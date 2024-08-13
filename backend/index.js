require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;
const IMG_URL = 'https://api.imgbb.com/1/upload';
const IMG_API_KEY = process.env.IMG_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(MONGODB_URI, { 
  
})
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
});

// Model for the images
const Image = mongoose.model('Image', imageSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Route to handle single image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    // Create a new FormData instance to hold the image data
    const form = new FormData();
    form.append('image', req.file.buffer, { filename: req.file.originalname });
    form.append('key', IMG_API_KEY);

    // Send the image data as form data to ImgBB
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

    // Generate a unique identifier for the image
    const identifier = await generateUniqueIdentifier();

    // Create and save the new image document in MongoDB
    const newImage = new Image({
      identifier,
      url: imgURL,
      description: req.body.description || '',
    });

    await newImage.save();

    res.status(200).json({ identifier, url: imgURL });
  } catch (error) {
    console.error('Error during image upload:', error.response ? error.response.data : error.message);
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

      // Save each image to the database
      const newImage = new Image({
        identifier,
        url: imgURL,
        description: '', // You may update this based on additional data from the request
      });

      await newImage.save();
      imageUrls.push({ identifier, url: imgURL });
      identifiers.push(identifier);
    }

    res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error('Error during multiple image upload:', error.response ? error.response.data : error.message);
    res.status(500).send('Error uploading images.');
  }
});

// Route to fetch images
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
