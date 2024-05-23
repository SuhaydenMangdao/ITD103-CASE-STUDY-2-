/*const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({
    time: Date,
    count: Number
})

const SensorModel = mongoose.model('SensorModel', sensorSchema)

module.exports = SensorModel;*/


const mongoose = require('mongoose');

// Define schema for the sensor data
const sensorSchema = new mongoose.Schema({
  time: { type: Date, required: true }, // Changed type to Date
  count: { type: Number, required: true } // Made count a required field
});

// Create a model for the sensor data
const SensorModel = mongoose.model('SensorModel', sensorSchema);

module.exports = SensorModel;

