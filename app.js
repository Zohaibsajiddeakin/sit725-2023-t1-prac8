document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    var locationValue = document.getElementById('location').value.trim();
    
    // Check if location is provided
    if (locationValue) {
      // Redirect to the desired URL with the parameters
      window.location.href = `http://127.0.0.1:5500/locate-a-socket.html?action=search&location=${encodeURIComponent(locationValue)}`;
    } else {
      alert('Please enter location');
    }
  });

  // Extract location from the search key
  const { locationn } = extractLocationFromSearchKey(window.location);

  // Send search request to server when the page loads
  console.log("location:", locationn);
  if (locationn) {
    fetchChargingStations(locationn);
  }
});

function extractLocationFromSearchKey(searchKeyObject) {
  const searchQuery = searchKeyObject.search;
  const urlParams = new URLSearchParams(searchQuery);
  const locationn = urlParams.get('location');
  return { locationn };
}

async function fetchChargingStations(locationn) {
  try {
    const response = await fetch(`http://localhost:4000/search?location=${encodeURIComponent(locationn)}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch charging stations');
    }

    const chargingStations = await response.json();
    console.log('DATA', chargingStations);

    // Display charging station data in HTML
    const chargingStationsContainer = document.getElementById('charging-stations');
    chargingStationsContainer.innerHTML = '';

    if (chargingStations.length === 0) {
      chargingStationsContainer.innerHTML = '<p>No charging stations found for the provided location.</p>';
    } else {
      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Availability</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${chargingStations.map(station => `
            <tr>
              <td>${station.name}</td>
              <td>${station.location}</td>
              <td>${station.availability}</td>
              <td>${station.price}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
      chargingStationsContainer.appendChild(table);
    }
  } catch (error) {
    console.error('Error fetching charging stations:', error.message);
  }
}
