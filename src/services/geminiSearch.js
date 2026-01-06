// Gemini with Google Search Grounding for real-time data
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Model with Google Search grounding enabled
// Using gemini-2.5-flash (same as main AI model)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  // Enable Google Search grounding
  tools: [{ googleSearch: {} }],
});

const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
};

// Common Indian airport codes mapping
const airportCodes = {
  'delhi': 'DEL', 'new delhi': 'DEL', 'mumbai': 'BOM', 'bangalore': 'BLR',
  'bengaluru': 'BLR', 'chennai': 'MAA', 'kolkata': 'CCU', 'hyderabad': 'HYD',
  'pune': 'PNQ', 'ahmedabad': 'AMD', 'goa': 'GOI', 'jaipur': 'JAI',
  'lucknow': 'LKO', 'kochi': 'COK', 'cochin': 'COK', 'guwahati': 'GAU',
  'patna': 'PAT', 'chandigarh': 'IXC', 'amritsar': 'ATQ', 'varanasi': 'VNS',
  'indore': 'IDR', 'nagpur': 'NAG', 'srinagar': 'SXR', 'leh': 'IXL',
  'udaipur': 'UDR', 'agra': 'AGR', 'dehradun': 'DED', 'jammu': 'IXJ',
  'vasco da gama': 'GOI', 'panaji': 'GOI', 'thiruvananthapuram': 'TRV',
};

// Get airport code from city name
export function getAirportCode(city) {
  if (!city) return null;
  const normalized = city.toLowerCase().trim();
  if (airportCodes[normalized]) return airportCodes[normalized];
  for (const [name, code] of Object.entries(airportCodes)) {
    if (normalized.includes(name) || name.includes(normalized)) return code;
  }
  return null;
}

// Simple in-memory cache to avoid repeated API calls
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function searchTransportData(source, destination, forceRefresh = false) {
  const cacheKey = `${source.toLowerCase()}-${destination.toLowerCase()}`;
  
  // Check cache first (unless force refresh)
  if (!forceRefresh && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached transport data');
      return cached.data;
    }
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const prompt = `Search the web for current flight and train options from ${source} to ${destination} in India.

Today's date is ${dateStr}.

Find and return REAL flight and train information. Search for:
1. Direct flights between these cities - include airline names, flight numbers, approximate timings
2. Direct trains between these cities - include train names, train numbers, timings
3. Approximate distance by road

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no code blocks):
{
  "flights": [
    {
      "airline": "airline name",
      "flightNumber": "flight number like AI-XXX or 6E-XXX",
      "departureTime": "approximate departure time",
      "arrivalTime": "approximate arrival time",
      "duration": "flight duration",
      "frequency": "daily/weekly"
    }
  ],
  "trains": [
    {
      "name": "train name",
      "number": "5-digit train number",
      "departureTime": "departure time",
      "arrivalTime": "arrival time", 
      "duration": "journey duration",
      "frequency": "daily/weekly/specific days"
    }
  ],
  "distanceByRoad": "distance in km",
  "timeByRoad": "driving time"
}

Important: Return ONLY the JSON, no other text. Search the web for accurate current data.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    let text = response.text();

    // Log grounding metadata if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata) {
      console.log('Search grounding used:', groundingMetadata.searchEntryPoint?.renderedContent ? 'Yes' : 'No');
      console.log('Web search queries:', groundingMetadata.webSearchQueries || []);
    }

    // Clean the response
    text = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Find JSON in response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let data;
    if (jsonMatch) {
      data = JSON.parse(jsonMatch[0]);
    } else {
      data = JSON.parse(text);
    }

    // Cache the result
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('Gemini search error:', error);
    
    // If rate limited, return cached data if available (even if expired)
    if (cache.has(cacheKey)) {
      console.log('Rate limited - returning cached data');
      return cache.get(cacheKey).data;
    }
    
    return {
      flights: [],
      trains: [],
      error: error.message?.includes('429') 
        ? 'API rate limit reached. Please try again in a minute.'
        : (error.message || 'Failed to fetch transport data')
    };
  }
}

export default { searchTransportData, getAirportCode };
