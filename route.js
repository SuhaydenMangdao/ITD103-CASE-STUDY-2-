// Assuming you have an Express app set up
const express = require('express');
const router = express.Router();
const SensorModel = require('./sensorModel');

// Route to fetch entrance sensor data
router.get('/getEntranceData', async (req, res) => {
    try {
        const entranceData = await SensorModel.find({}, null, { collection: 'sensormodels' });
        res.json(entranceData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch exit sensor data
router.get('/getExitData', async (req, res) => {
    try {
        const exitData = await SensorModel.find({}, null, { collection: 'exitsensormodels' });
        res.json(exitData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
