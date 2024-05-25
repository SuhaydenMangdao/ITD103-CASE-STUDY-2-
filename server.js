const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const path = require('path');
const SensorModel = require('./sensorModel'); // Import the sensor model
const exitSensorModel = require('./exitsensorModel');

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


// Endpoint to receive entrance sensor data
app.get('/addEntranceData', async (req, res) => {
  const { count, time, entranceStatus } = req.query;
  console.log('ENTRANCE ADDED');
  console.log('Status', String(entranceStatus));
  console.log('Count:', count);
  if (count === undefined || time === undefined || entranceStatus === undefined) {
    return res.status(400).send('Missing count, time, or entranceStatus parameter');
  }

  try {
    const entranceData = new SensorModel({ count: parseInt(count), time: convertToPST(time), entranceStatus: entranceStatus.toString() });
    await entranceData.save();
    res.status(200).send('Entrance sensor data saved successfully');
  } catch (error) {
    console.error('Error saving entrance sensor data:', error);
    res.status(500).send('Error saving entrance sensor data');
  }
});


// Endpoint to receive exit sensor data
app.get('/addExitData', async (req, res) => {
  const { count, time, exitStatus } = req.query;

  console.log('EXIT ADDED');
  console.log('Status', String(exitStatus))
  console.log('Count:', count);

  if (count === undefined || time === undefined || exitStatus === undefined) {
    return res.status(400).send('Missing count or time parameter');
  }

  try {
    //const exitData = new exitSensorModel({ count: parseInt(count), time: convertToPST(time), status: parseString(exitStatus) });
    const exitData = new exitSensorModel({ count: parseInt(count), time: convertToPST(time), exitStatus: exitStatus.toString() });

    await exitData.save();
    res.status(200).send('Exit sensor data saved successfully');
  } catch (error) {
    console.error('Error saving exit sensor data:', error);
    res.status(500).send('Error saving exit sensor data');
  }
});

  // Function to parse time string in the format "MM/DD/YY/HH:MM:SS" and convert it to PST
  function convertToPST(timeString) {
    const [month, day, year, time] = timeString.split('/');
    const [hour, minute, second] = time.split(':');
    const utcTime = moment.tz(`20${year}-${month}-${day}T${hour}:${minute}:${second}`, "UTC");
    const pstTime = utcTime.clone().tz("Asia/Manila").toDate();
    return pstTime;
  }

  // Route to display all entrance sensor data
  app.get('/getEntranceData', async (req, res) => {
    try {
      //const entranceData = await SensorModel.find(); // Assuming all data are of the same type
      const entranceData = await SensorModel.find().sort({ _id: -1 }).limit(20);
      res.status(200).json(entranceData);
    } catch (error) {
      console.error('Error fetching entrance sensor data:', error);
      res.status(500).send('Error fetching entrance sensor data');
    }
  });

// Route to display all exit sensor data
app.get('/getExitData', async (req, res) => {
  try {
    //const exitData = await exitSensorModel.find(); // Assuming all data are of the same type
    const exitData = await exitSensorModel.find().sort({ _id: -1 }).limit(20);
    res.status(200).json(exitData);
  } catch (error) {
    console.error('Error fetching exit sensor data:', error);
    res.status(500).send('Error fetching exit sensor data');
  }
});

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join('C:\\Users\\aineo\\OneDrive\\Documents\\GitHub\\casestudy2', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
//final logic