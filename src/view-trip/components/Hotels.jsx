import React from 'react';
import HotelCard from './HotelCard';

function Hotels({ tripInfo }) {
  const hotels = tripInfo?.tripData?.hotels || [];
  const destination = tripInfo?.tripData?.destination;

  if (!hotels.length) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Recommended Hotels
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotelInfo={hotel} destination={destination} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
