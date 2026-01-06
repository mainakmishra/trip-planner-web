/**
 * Geoapify API Service
 * 
 * Free tier: 3,000 requests/day
 * Used for: Place autocomplete, geocoding, and place search
 * 
 * @see https://www.geoapify.com/
 */

const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1';
const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

/**
 * Search for place suggestions based on user input
 * @param {string} query - The search query
 * @param {Object} options - Optional parameters
 * @param {number} options.limit - Maximum number of results (default: 5)
 * @param {string} options.type - Filter by place type (e.g., 'city', 'street')
 * @returns {Promise<Array>} Array of place suggestions
 */
export async function getPlaceSuggestions(query, options = {}) {
  const { limit = 5, type = '' } = options;
  
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    text: query.trim(),
    apiKey: API_KEY,
    limit: limit.toString(),
    format: 'json',
  });

  if (type) {
    params.append('type', type);
  }

  try {
    const response = await fetch(`${GEOAPIFY_BASE_URL}/geocode/autocomplete?${params}`);
    
    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform to a consistent format compatible with the existing component
    return (data.results || []).map((result) => ({
      place_id: result.place_id,
      description: result.formatted,
      structured_formatting: {
        main_text: result.name || result.city || result.street,
        secondary_text: result.country,
      },
      geometry: {
        lat: result.lat,
        lon: result.lon,
      },
      // Keep original data for reference
      raw: result,
    }));
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    return [];
  }
}

/**
 * Get details for a specific place by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object|null>} Place details or null
 */
export async function getPlaceDetails(lat, lon) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    apiKey: API_KEY,
  });

  try {
    const response = await fetch(`${GEOAPIFY_BASE_URL}/geocode/reverse?${params}`);
    
    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.features?.[0]?.properties || null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Search for a place by name and get its coordinates
 * @param {string} placeName - The name of the place to search
 * @returns {Promise<Object|null>} Place data with coordinates or null
 */
export async function searchPlace(placeName) {
  const params = new URLSearchParams({
    text: placeName,
    apiKey: API_KEY,
    limit: '1',
    format: 'json',
  });

  try {
    const response = await fetch(`${GEOAPIFY_BASE_URL}/geocode/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results?.[0];
    
    if (!result) return null;

    return {
      name: result.name || result.formatted,
      formatted: result.formatted,
      lat: result.lat,
      lon: result.lon,
      country: result.country,
      city: result.city,
      place_id: result.place_id,
    };
  } catch (error) {
    console.error('Error searching place:', error);
    return null;
  }
}

export default {
  getPlaceSuggestions,
  getPlaceDetails,
  searchPlace,
};
