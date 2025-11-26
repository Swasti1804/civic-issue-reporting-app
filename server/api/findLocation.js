const https = require('https');

const OPENCAGE_API_KEY = 'ebfead9fa957416aaaad80e2b3deeb1e'; // Consider using environment variables in production

// Function to fetch data from OpenCage API with better error handling
const fetchLocationData = (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'HamaraSheharApp/1.0 (contact@hamarashehar.com)',
        'Accept': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    }, (res) => {
      // Check for bad status codes
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`API request failed with status code ${res.statusCode}`));
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          // Check for API error responses
          if (result.status && result.status.code !== 200) {
            return reject(new Error(result.status.message || 'OpenCage API error'));
          }
          resolve(result);
        } catch (err) {
          reject(new Error('Failed to parse API response'));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

async function findLocation(query) {
  // Input validation
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid location query');
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    throw new Error('Empty location query');
  }

  const coordRegex = /^-?\d{1,3}(\.\d+)?\s*,\s*-?\d{1,3}(\.\d+)?$/;
  let url;

  try {
    if (coordRegex.test(trimmedQuery)) {
      // Handle coordinate search
      const [lat, lon] = trimmedQuery.split(',').map(coord => parseFloat(coord.trim()));
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        throw new Error('Invalid coordinates - latitude must be between -90 and 90, longitude between -180 and 180');
      }
      url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}&no_annotations=1&limit=1`;
    } else {
      // Handle text search
      if (trimmedQuery.length < 2) {
        throw new Error('Search query too short');
      }
      url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(trimmedQuery)}&key=${OPENCAGE_API_KEY}&no_annotations=1&limit=1`;
    }

    console.log("🔍 Requesting URL:", url);

    const result = await fetchLocationData(url);
    console.log("✅ OpenCage API Response:", JSON.stringify(result, null, 2));

    if (result.results && result.results.length > 0) {
      const { geometry, formatted, components } = result.results[0];
      
      // Construct a more detailed display name
      let displayName = formatted;
      if (components) {
        const { city, town, village, state, postcode, country } = components;
        const locality = city || town || village;
        if (locality && state) {
          displayName = `${locality}, ${state}, ${country}`;
          if (postcode) displayName += ` ${postcode}`;
        }
      }

      return {
        success: true,
        lat: geometry.lat,
        lon: geometry.lng,
        display_name: displayName,
        components: components || {}
      };
    } else {
      throw new Error('No matching location found');
    }
  } catch (err) {
    console.error("❌ Error fetching location:", err.message);
    return {
      success: false,
      error: err.message,
      query: trimmedQuery
    };
  }
}

module.exports = {
  findLocation,
  fetchLocationData // Export for testing if needed
};