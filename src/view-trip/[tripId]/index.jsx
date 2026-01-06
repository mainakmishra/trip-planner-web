import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseconfig';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import Places from '../components/Places';
import Footer from '../components/Footer';
import Transport from '../components/Transport';

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);
    
  const GetTripData = async () => {
    try {
      const docRef = doc(db, "Trips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        toast.error('Trip not found');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast.error('Failed to load trip');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-80 bg-gray-100 rounded-2xl" />
            <div className="h-8 bg-gray-100 rounded w-1/3" />
            <div className="grid grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <InfoSection tripInfo={trip} />
        <Transport tripInfo={trip} />
        <Hotels tripInfo={trip} />
        <Places tripInfo={trip} />
        <Footer />
      </div>
    </div>
  );
}

export default ViewTrip;
