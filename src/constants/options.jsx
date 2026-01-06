export const SelectTravelList=[
    {
        id:1,
        title:'Just me',
        desc:'Lone wolf',
        icon:'🛩️',
        people:'1'
    },
    {
        id:2,
        title:'A couple',
        desc:'Two travellers in tandem',
        icon:'🥂',
        people:'2'
    },
    {
        id:3,
        title:'Family/Friends',
        desc:'A group of fun loving adventurers',
        icon:'🏘️',
        people:'3 to 10 or more'
    },
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:'Low',
        desc:'A thrifty trip alone',
        icon:'💵',
    },
    {
        id:2,
        title:'Moderate',
        desc:'Explore more, spend wisely',
        icon:'💸',
    },
    {
        id:3,
        title:'Luxury',
        desc:'Elevate your journey with unforgettable experiences',
        icon:'🤑',
    },
]

export const systemprompt = `
You are a travel planning assistant. Generate a detailed travel plan in JSON format.

IMPORTANT RULES:
- Give all prices in the currency of the starting location country
- Provide complete addresses for all hotels and places
- Include at least 5 hotels and 3 places per day
- DO NOT include flight or train data - this will be fetched separately from live sources
- Focus only on: destination info, hotels, and daily itinerary

Trip Details:
- Source: {startingPoint}
- Destination: {destination}
- Duration: {days} days
- Travelers: {companions}
- Budget: {budget}

Generate JSON with this exact structure:
{
  "source": "starting city",
  "destination": "destination city",
  "duration": "X Days",
  "travelers": "type",
  "budget": "budget level",
  "distanceByRoad": "approximate distance in km",
  "timeByRoad": "approximate driving time",
  "hotels": [
    {
      "name": "Hotel Name",
      "address": "Full address",
      "price": "Price per night in local currency",
      "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
      "rating": 4.5,
      "description": "Brief description"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "name": "Place Name",
          "address": "Full address",
          "details": "Description of the place",
          "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
          "ticketPricing": "Free or price",
          "rating": 4.5,
          "bestTimeToVisit": "Morning/Afternoon/Evening",
          "timeToTravelFromPreviousLocation": "X minutes"
        }
      ]
    }
  ]
}

Remember: NO flight or train data. Only hotels and itinerary.
`;
