// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Sample data for charging stations (replace with actual data)
const chargingStations = [
  { id: 1, name: 'Station A', location: '123 Main St', availability: 'Available', price: '$5/hour' },
  { id: 2, name: 'Station B', location: '456 Elm St', availability: 'Unavailable', price: '$7/hour' },
  { id:3, name: 'Station C', location: '123 Main St', availability: 'Available', price: '$54/hour' },
  { id: 4, name: 'Station D', location: '123 Main St', availability: 'Available', price: '$34/hour' },

];

app.get('/search', (req, res) => {
  const location = req.query.location; // Access location from query string

  if (!location) {
    res.status(400).json({ message: "Missing location parameter in query string" });
    return; // Exit the function if no location provided
  }

  // Filter based on location and availability (optional)
  const searchResults = chargingStations.filter(station => station.location === location);

  res.json(searchResults);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
