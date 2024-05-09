// app.js (Controller/View)

document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('searchForm');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    var locationValue = document.getElementById('location').value.trim();
    
    // Check if location is provided
    if (locationValue) {
      // Call controller function to handle search
      searchChargingStations(locationValue);
    } else {
      alert('Please enter location');
    }
  });
});

async function searchChargingStations(location) {
  try {
    const response = await fetch(`http://localhost:4000/search?location=${encodeURIComponent(location)}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch charging stations');
    }

    const chargingStations = await response.json();
    displayChargingStations(chargingStations);
  } catch (error) {
    console.error('Error fetching charging stations:', error.message);
  }
}

function displayChargingStations(chargingStations) {
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
}
