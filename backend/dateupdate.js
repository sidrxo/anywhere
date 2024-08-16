require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the image schema
const imageSchema = new mongoose.Schema({
  identifier: { type: String, unique: true },
  url: String,
  description: String,
  tags: [String],
  uploadDate: { type: Date, default: Date.now } // Add uploadDate field
});

// Model for the images
const Image = mongoose.model('Image', imageSchema);

const updateUploadDates = async () => {
  try {
    // Update uploadDate to today's date for all images
    const result = await Image.updateMany(
      { uploadDate: { $exists: false } }, // Select images without uploadDate
      { $set: { uploadDate: new Date() } } // Set uploadDate to today's date
    );

    console.log(`Matched ${result.matchedCount} documents, modified ${result.modifiedCount} documents.`);
  } catch (error) {
    console.error('Error updating upload dates:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Execute the script
updateUploadDates();
