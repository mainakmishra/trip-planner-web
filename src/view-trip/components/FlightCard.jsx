import React from 'react';

// Helper to render price - handles both string and object formats
function formatPrice(price) {
  if (!price) return 'N/A';
  if (typeof price === 'string') return price;
  if (typeof price === 'object') {
    return Object.entries(price)
      .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
      .join(' | ');
  }
  return String(price);
}

function FlightCard({ tripInfo }) {
  const flights = tripInfo?.tripData?.travelDetails?.flights || [];
  
  if (!flights.length) {
    return (
      <div>
        <div className='font-bold text-xl mb-4 mt-6 text-gray-800'>Flights</div>
        <p className='text-gray-500'>No flight information available for this route.</p>
      </div>
    );
  }

  return (
    <div>
      <div className='font-bold text-xl mb-4 mt-6 text-gray-800'>Flights</div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {flights.map((flight, index) => (
          <div
            key={index}
            className='bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 border border-blue-100'
          >
            <h2 className='text-lg font-semibold mb-2 text-blue-800'>
              {flight?.airline || 'Flight'} {flight?.flightNumber || ''}
            </h2>
            {flight?.departureTime && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Departure:</span> {flight.departureTime}
              </p>
            )}
            {flight?.arrivalTime && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Arrival:</span> {flight.arrivalTime}
              </p>
            )}
            {flight?.duration && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Duration:</span> {flight.duration}
              </p>
            )}
            {flight?.price && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Price:</span> {formatPrice(flight.price)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightCard;
