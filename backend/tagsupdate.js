require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the image schema
const imageSchema = new mongoose.Schema({
  identifier: { type: String, unique: true },
  url: String,
  description: String,
  tags: [String], // Ensure the tags field is an array of strings
});

// Model for the images
const Image = mongoose.model('Image', imageSchema);

// Function to fetch and analyze an image
const analyzeImage = async (imageUrl) => {
  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const subscriptionKey = process.env.AZURE_VISION_API_KEY;

  const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Tags`;

  try {
    const response = await axios.post(url, { url: imageUrl }, {
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      }
    });

    return response.data.tags.map(tag => tag.name);
  } catch (error) {
    console.error('Error fetching image tags:', error.response ? error.response.data : error.message);
    return [];
  }
};

// Process a batch of images
const processBatch = async (batch) => {
  const updates = [];

  for (const image of batch) {
    console.log(`Processing image: ${image.identifier}`);

    // Get tags from Azure Cognitive Services
    const tags = await analyzeImage(image.url);

    // Update the image with the fetched tags
    if (tags.length > 0) {
      image.tags = tags;
      updates.push(image.save());
      console.log(`Tags updated for image: ${image.identifier}`);
    } else {
      console.log(`No tags found for image: ${image.identifier}`);
    }
  }

  // Wait for all updates to complete
  await Promise.all(updates);
};

// Main script to process images
const processImages = async () => {
  try {
    let allImagesTagged = false;
    let skip = 0;
    const limit = 20;

    while (!allImagesTagged) {
      // Fetch a batch of images without tags
      const images = await Image.find({ tags: { $exists: false } }).skip(skip).limit(limit);

      if (images.length === 0) {
        allImagesTagged = true;
        break;
      }

      await processBatch(images);

      // Update the skip value to get the next batch
      skip += limit;
    }

    console.log('All images processed.');

    // Fetch and log all images
    const allImages = await Image.find();
    console.log('All images:', allImages);

  } catch (error) {
    console.error('Error processing images:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Execute the script
processImages();
