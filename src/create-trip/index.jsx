import React, { useEffect, useState } from 'react';
import Autocomplete from '@/components/autocomplete'; // Import your custom Autocomplete component
import { Input } from '@/components/ui/input';
import { SelectBudgetOptions, SelectTravelList, systemprompt } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner'; // Import Sonner toast and Toaster
import { chatSession } from '@/services/aimodel';
import { useGoogleLogin, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useGoogleOAuth } from '@react-oauth/google';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/services/firebaseconfig';
import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function CreateTrip() {
  const [formData, setFormData] = useState({
    startingPoint: '', // State for starting point
    destination: '', // State for destination
    days: '', // State for days
    budget: '', // State for budget
    companions: '', // State for companions
  });

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);



  // Handle input changes
  const handleInputChange = (name, value) => {
    console.log(`Updating ${name} with value:`, value); // Debugging
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Log formData changes
  useEffect(() => {
    console.log('formData updated:', formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (resp) => {
      console.log(resp);
      getUserProfile(resp)
    },
    onError: (error) => console.log(error)
  });

  const onGenerateTrip = async () => {

    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }


    if (!formData.startingPoint || !formData.destination || !formData.budget || !formData.companions) {
      toast("Please fill all the details before generating trip!", {
        className: 'sonner-toast-nudge', // Apply the nudge animation
        style: {
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fca5a5',
        },
      });
    }
    else{
      console.log(formData);
      setLoading(true);
      const final_prompt = systemprompt
        .replace('{startingPoint}', formData?.startingPoint)
        .replace('{destination}', formData?.destination)
        .replace('{days}', formData?.days)
        .replace('{budget}', formData?.budget)
        .replace('{companions}', formData?.companions)

      console.log(final_prompt);
      const result = await chatSession.sendMessage(final_prompt);
      console.log(result?.response?.text());
      setLoading(false);
      SaveTrip(result?.response?.text());
    }
  };

  const SaveTrip = async (TripData) => {

    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    const docId = Date.now().toString()
    await setDoc(doc(db, "Trips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      userName: user?.given_name,
      id: docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId);
  }

  const getUserProfile = (tokenInfo) => {
    console.log('Fetching user profile with token:', tokenInfo);

    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Application/json'
        }
      }
    )
      .then((response) => {
        console.log('User Profile Data:', response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        setOpenDialog(false);
        onGenerateTrip();
      })
  };

  return (
    <div className='max-w-4xl mx-auto px-5 mt-10'>
      {/* Add the Toaster component */}
      <Toaster
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif', // Apply the Inter font globally
            backgroundColor: '#fee2e2', // Light red background
            color: '#dc2626', // Dark red text
            border: '1px solid #fca5a5', // Red border
          },
        }}
      />

      <h2 className='font-bold text-3xl text-center'>Tell us your travel preferences 🏕️🌴🌊</h2>
      <p className='mt-3 text-gray-500 text-xl text-center'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      {/* Starting Point Section */}
      <div className='mt-20'>
        <div>
          <h2 className='text-xl my-3 font-medium'>Where are you starting at? 🏡</h2>
          {/* Autocomplete for starting point */}
          <Autocomplete
            onSelect={(suggestion) =>
              handleInputChange('startingPoint', suggestion.description)
            }
            selectProps={{
              place: formData.startingPoint,
              onchange: (v) => handleInputChange('startingPoint', v),
            }}
          />
        </div>
      </div>

      {/* Destination Section */}
      <div className='mt-20'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice? 📍</h2>
          {/* Autocomplete for destination */}
          <Autocomplete
            onSelect={(suggestion) =>
              handleInputChange('destination', suggestion.description)
            }
            selectProps={{
              place: formData.destination,
              onchange: (v) => handleInputChange('destination', v),
            }}
          />
        </div>
      </div>

      {/* Days Section */}
      <div className='mt-20'>
        <h2 className='text-xl my-3 font-medium'>How many days are you planning to stay?</h2>
        <Input
          placeholder={'Ex. 3 days'}
          type="number"
          value={formData.days}
          onChange={(e) => handleInputChange('days', e.target.value)} // Update formData for days
        />
      </div>

      {/* Budget Section */}
      <div className='mt-20'>
        <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange('budget', item.title)} // Update formData for budget
              className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg transition-all
                ${formData.budget === item.title
                  ? 'border-pink-300 shadow-lg shadow-pink-200/50 bg-pink-50' // Light pink shadow and border
                  : 'border-gray-200' // Default border
                }
              `}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Companions Section */}
      <div className='mt-20'>
        <h2 className='text-xl my-3 font-medium'>Who are you planning to go with on your next trip?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-5'>
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange('companions', item.title)} // Update formData for companions
              className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg transition-all
                ${formData.companions === item.title
                  ? 'border-pink-300 shadow-lg shadow-pink-200/50 bg-pink-50' // Light pink shadow and border
                  : 'border-gray-200' // Default border
                }
              `}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              <h2 className='flex flex-col text-sm text-gray-500 mt-1'>{item.people}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Trip Button */}
      <div className='mt-20 flex justify-end'>
        <Button className='w-full md:w-auto' onClick={onGenerateTrip}>
          {loading ?
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
          }
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="logo.svg" alt="" />
              <h2 className='font-bold text-lg mt-7'>Sign in with Google</h2>
              <p className='mt-1'>Securely sign in with Google account</p>
              <Button
                onClick={login} className='w-full mt-5 flex gap-4 items-center'>
                <FcGoogle className='h-7 w-7 flex' />Sign In with Google


              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>





    </div>
  );
}

export default CreateTrip;