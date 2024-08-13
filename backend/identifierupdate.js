require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {

});

const imageSchema = new Schema({
  url: String,
  description: String,
  identifier: String, // Add this field
});

const Image = mongoose.model('Image', imageSchema);

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 5).toUpperCase(); // Generates a 5-character alphanumeric code
};

const updateImagesWithIdentifier = async () => {
  try {
    const images = await Image.find({ identifier: { $exists: false } }); // Find images without an identifier
    for (const image of images) {
      let uniqueId;
      let isUnique = false;
      
      // Ensure the identifier is unique
      while (!isUnique) {
        uniqueId = generateUniqueId();
        const existingImage = await Image.findOne({ identifier: uniqueId });
        if (!existingImage) {
          isUnique = true;
        }
      }

      image.identifier = uniqueId;
      await image.save();
      console.log(`Updated image with ID ${image._id} to identifier ${uniqueId}`);
    }

    console.log('Update complete.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating images:', error);
    mongoose.connection.close();
  }
};

updateImagesWithIdentifier();
