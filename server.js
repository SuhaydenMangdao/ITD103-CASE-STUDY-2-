const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define schemas and models for the entrance and exit sensors
const entranceSensorSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  count: Number,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'entranceSensor' });

const exitSensorSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  count: Number,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'exitSensor' });

const EntranceSensor = mongoose.model('EntranceSensor', entranceSensorSchema);
const ExitSensor = mongoose.model('ExitSensor', exitSensorSchema);

// Endpoint to receive entrance sensor data
app.post('/addEntranceData', async (req, res) => {
  const { count } = req.query;

  if (!count) {
    return res.status(400).send('Missing count parameter');
  }

  try {
    const entranceData = new EntranceSensor({ count: parseInt(count) });
    await entranceData.save();
    res.status(200).send('Entrance sensor data saved successfully');
  } catch (error) {
    res.status(500).send('Error saving entrance sensor data');
  }
});

// Endpoint to receive exit sensor data
app.post('/addExitData', async (req, res) => {
  const { count } = req.query;

  if (!count) {
    return res.status(400).send('Missing count parameter');
  }

  try {
    const exitData = new ExitSensor({ count: parseInt(count) });
    await exitData.save();
    res.status(200).send('Hello World'); // Send 'Hello World' on successful save
  } catch (error) {
    res.status(500).send('Error saving exit sensor data');
  }
});


// Route to display "Hello World" on the webpage
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
