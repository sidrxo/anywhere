// visionService.js
require('dotenv').config();
const axios = require('axios');

const VISION_API_ENDPOINT = process.env.VISION_API_ENDPOINT;
const VISION_API_KEY = process.env.VISION_API_KEY;

const analyzeImage = async (imageUrl) => {
  try {
    console.log(`Sending request to Computer Vision API for image: ${imageUrl}`);
    const response = await axios.post(
      `${VISION_API_ENDPOINT}/vision/v3.1/analyze?visualFeatures=Tags`,
      { url: imageUrl },
      {
        headers: {
          'Ocp-Apim-Subscription-Key': VISION_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Received response from Computer Vision API:', response.data);
    return response.data.tags;
  } catch (error) {
    console.error('Error analyzing image:', error.response ? error.response.data : error.message);
    throw new Error('Failed to analyze image.');
  }
};

module.exports = { analyzeImage };
