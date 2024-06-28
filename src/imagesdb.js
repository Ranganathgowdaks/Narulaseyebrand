const mongoose = require('mongoose');

// Define the schema
const imageSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  }
});

// Create the model
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
