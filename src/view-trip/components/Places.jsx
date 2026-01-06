import React from 'react';
import PlaceCard from './PlaceCard';

function Places({ tripInfo }) {
  const itinerary = tripInfo?.tripData?.itinerary || [];

  if (!itinerary.length) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Daily Itinerary
      </h2>
      
      <div className="space-y-8">
        {itinerary.map((dayPlan, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                {dayPlan?.day || index + 1}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Day {dayPlan?.day || index + 1}
              </h3>
            </div>
            
            <div className="ml-4 pl-7 border-l-2 border-gray-100 space-y-3">
              {dayPlan?.places?.map((place, placeIndex) => (
                <PlaceCard key={placeIndex} placeInfo={place} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Places;
