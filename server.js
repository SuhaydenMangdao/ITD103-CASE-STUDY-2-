// Server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const path = require('path');
//const SensorModel = require('./sensorModel'); // Import the sensor model

dotenv.config();
const app = express();
const port = 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

  const SensorSchema = new mongoose.Schema({
    entranceCount: { type: Number},
    exitCount: { type: Number},
    time: { type: Date}
  });
  
  const SensorModel = mongoose.model("sensors", SensorSchema);
  

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/addsensordata', (req, res) => {
  const { entranceCount, exitCount, time } = req.body; // Extract parameters from body
  const sensorData = { entranceCount, exitCount, time }; // Construct user data object

  SensorModel.create(sensorData)
      .then(sensor => res.json(sensor))
      .catch(err => res.json(err));
      console.log('Entrance Count:', entranceCount);
      console.log('Exit Count:', exitCount);
      console.log('Time:', time);
});


// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Route to fetch sensor data
app.get('/getsensordata', (req, res) => {
  SensorModel.find()
    .then(sensorData => res.json(sensorData))
    .catch(err => res.status(500).json({ error: 'Error fetching sensor data' }));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
