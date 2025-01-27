import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'; // Correct import
import CreateTrip from './create-trip/index.jsx';
import ViewTrip from './view-trip/[tripId]';
import Header from './components/ui/custom/header';
import Hero from './components/ui/custom/Hero';
import { Toaster } from './components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Define your routes


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Hero />
        <App />
      </>
    ),
  },
  {
    path: '/create-trip',
    element: (
      <>
        <Header />
        <CreateTrip />
      </>
    ),
  },
  {
    path: '/view-trip/:tripId',
    element: (
      <>
        <Header />
        <ViewTrip />
      </>
    ),
  },
]);

// Render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
);