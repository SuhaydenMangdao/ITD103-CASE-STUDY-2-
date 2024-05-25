const mongoose = require('mongoose');

// Define schema for the sensor data
const exitsensorSchema = new mongoose.Schema({
  time: { type: Date, required: true }, // Changed type to Date
  count: { type: Number, required: true }, // Made count a required field
  exitStatus: { type: Number, required: false } // Made status a required field
});

// Create a model for the sensor data
const exitSensorModel = mongoose.model('exitSensorModel', exitsensorSchema);

module.exports = exitSensorModel;