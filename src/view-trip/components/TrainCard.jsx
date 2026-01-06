import React from 'react';

// Helper to render price - handles both string and object formats
function formatPrice(price) {
  if (!price) return 'N/A';
  if (typeof price === 'string') return price;
  if (typeof price === 'object') {
    // Convert object like {AC_First_Class: "₹2000", AC_Two_Tier: "₹1500"} to readable format
    return Object.entries(price)
      .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
      .join(' | ');
  }
  return String(price);
}

function TrainCard({ tripInfo }) {
  const trains = tripInfo?.tripData?.travelDetails?.trains || [];
  
  if (!trains.length) {
    return (
      <div>
        <div className='font-bold text-xl mb-4 text-gray-800 mt-10'>Trains</div>
        <p className='text-gray-500'>No train information available for this route.</p>
      </div>
    );
  }

  return (
    <div>
      <div className='font-bold text-xl mb-4 text-gray-800 mt-10'>Trains</div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {trains.map((train, index) => (
          <div
            key={index}
            className='bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 border border-blue-100'
          >
            <h2 className='text-lg font-semibold mb-2 text-blue-800'>{train?.name || 'Train'}</h2>
            {train?.number && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Train Number:</span> {train.number}
              </p>
            )}
            {train?.departureTime && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Departure:</span> {train.departureTime}
              </p>
            )}
            {train?.arrivalTime && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Arrival:</span> {train.arrivalTime}
              </p>
            )}
            {train?.duration && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Duration:</span> {train.duration}
              </p>
            )}
            {train?.price && (
              <p className='text-gray-700 mb-1'>
                <span className='font-bold text-blue-600'>Price:</span> {formatPrice(train.price)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainCard;
