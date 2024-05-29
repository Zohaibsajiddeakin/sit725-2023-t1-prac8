// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); 


// Create Express application
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname))); // Serve from root directory


// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------------- Models -------------------------

// Define the Mongoose schema and model for charging stations
const chargingStationSchema = new mongoose.Schema({
  name: String,
  location: String,
  availability: String,
  price: String
});
const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

// ------------------------- Controllers -------------------------

// Route handler function to search for charging stations
app.get('/search', async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).json({ message: "Missing location parameter in query string" });
  }

  try {
    const searchResults = await ChargingStation.find({ location: location }).lean();
    res.json(searchResults);
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ------------------------- Server Setup -------------------------

// Connect to MongoDB and start server

mongoose.connect("mongodb://mongodb:27017/locate-a-socket")
  .then(async () => {
    console.log('Connected to MongoDB');

    // Check if sample data already exists
    const count = await ChargingStation.countDocuments();
    if (count === 0) {
      // Create an array of charging station documents
      const stations = [
        {
          name: 'Station A',
          location: '123 Main St',
          availability: 'Available',
          price: '$10/hour'
        },
        {
          name: 'Station B',
          location: '456 Elm St',
          availability: 'Not Available',
          price: '$12/hour'
        },
        {
          name: 'Station C',
          location: '789 Pine St',
          availability: 'Available',
          price: '$9/hour'
        },
        {
          name: 'Station D',
          location: '101 Oak Ave',
          availability: 'Available',
          price: '$11/hour'
        },
        {
          name: 'Station E',
          location: '222 Maple Ln',
          availability: 'Not Available',
          price: '$15/hour'
        }
      ];

      // Insert all documents into the database
      await ChargingStation.insertMany(stations);

      console.log('Sample charging stations added successfully');
    } else {
      console.log('Sample charging stations already exist in the database');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
