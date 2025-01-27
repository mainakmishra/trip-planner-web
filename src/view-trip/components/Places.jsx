import React from 'react';
import PlaceCard from './PlaceCard';
import { LuAlarmClockCheck } from "react-icons/lu";

function Places({ tripInfo }) {
  return (
    <div>
      <h2 className='font-bold text-lg my-10'>Places to visit</h2>

      <div>
        {tripInfo.tripData?.itinerary.map((item, index) => (
          <div key={index}>
            <h2 className='text-lg font-medium my-5'>Day {item.day}</h2>
            <div className='grid md:grid-cols-2 gap-5'>
              {item.places.map((place, index) => (
                <div className='my-3' key={index}>
                  <PlaceCard placeInfo={place} />
                  <div className='flex items-center mt-2'>
                    <LuAlarmClockCheck className='mx-2 font-medium text-sm text-orange-700' />
                    <span className='ml-2 text-sm'>{place.bestTimeToVisit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Places;