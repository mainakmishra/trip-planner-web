// Image service using Wikipedia + Google for actual place/hotel photos

const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// Cache
const photoCache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hour cache

function getCacheKey(query) {
  return query.toLowerCase().trim();
}

function isCacheValid(cached) {
  return cached && (Date.now() - cached.timestamp < CACHE_TTL);
}

// Fetch from Wikipedia with better search
async function fetchFromWikipedia(query, isHotel = false) {
  try {
    // For hotels, search with "hotel" keyword
    const searchQuery = isHotel ? `${query} hotel` : query;
    
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      generator: 'search',
      gsrsearch: searchQuery,
      gsrlimit: '3',
      prop: 'pageimages|pageterms',
      piprop: 'original',
      pilicense: 'any',
    });

    const response = await fetch(`${WIKI_API}?${searchParams}`);
    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;
    
    if (!pages) return null;

    // Find first page with an image
    for (const page of Object.values(pages)) {
      const imageUrl = page?.original?.source;
      if (imageUrl && !imageUrl.includes('.svg')) {
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return null;
  }
}

// Fallback to Pexels with better queries
async function fetchFromPexels(query, type = 'place') {
  if (!PEXELS_KEY || PEXELS_KEY === 'YOUR_PEXELS_API_KEY_HERE') return null;

  try {
    let searchQuery = query;
    if (type === 'hotel') {
      searchQuery = `${query} hotel luxury room`;
    } else if (type === 'destination') {
      searchQuery = `${query} landmark aerial`;
    }

    const params = new URLSearchParams({
      query: searchQuery,
      per_page: '1',
      orientation: 'landscape',
    });

    const response = await fetch(`${PEXELS_BASE_URL}/search?${params}`, {
      headers: { Authorization: PEXELS_KEY },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.photos?.[0]?.src?.large || null;
  } catch (error) {
    console.error('Pexels error:', error);
    return null;
  }
}

export async function searchPhoto(query, options = {}) {
  const { type = 'place', city = '' } = options;
  
  if (!query || query.trim().length < 2) {
    return null;
  }

  // For hotels, include city name for better results
  const searchQuery = type === 'hotel' && city ? `${query} ${city}` : query;
  const cacheKey = getCacheKey(searchQuery + type);

  // Check cache first
  const cached = photoCache.get(cacheKey);
  if (isCacheValid(cached)) {
    return cached.data;
  }

  // Try Wikipedia first
  let photoUrl = await fetchFromWikipedia(searchQuery, type === 'hotel');

  // Fall back to Pexels
  if (!photoUrl) {
    photoUrl = await fetchFromPexels(searchQuery, type);
  }

  // Cache result
  photoCache.set(cacheKey, {
    data: photoUrl,
    timestamp: Date.now(),
  });

  return photoUrl;
}

export function clearCache() {
  photoCache.clear();
}

export default { searchPhoto, clearCache };
