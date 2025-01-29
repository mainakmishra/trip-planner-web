import React from 'react';
import { Button } from '../button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-indigo-100 to-pink-100 px-4 md:px-16 lg:px-56 py-16">
      <h2 className="font-extrabold text-[40px] md:text-[50px] text-center text-gray-800 mt-8 flex flex-col gap-2">
        <span className="font-extrabold text-[#f56551] text-4xl md:text-5xl">
          Discover Your Next Adventure with AI
        </span>
        <span className="font-bold text-[20px] md:text-[24px] text-gray-700">
          Trip planner with personalized itineraries, tickets, hotels, and much more
        </span>
        <p className="text-sm md:text-base text-gray-500 text-center mt-3 max-w-3xl mx-auto">
          Your personal trip planner and curator, creating custom itineraries tailored to your interests, style, and budget.
        </p>
        <Link to="/create-trip" className="mt-6">
          <Button className="text-white bg-[#f56551] hover:bg-[#e53e3e] transition duration-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105">
            Get Started for Free!
          </Button>
        </Link>
      </h2>
      <img
        src="/landing.png"
        alt="Travel illustration"
        className="rounded-2xl shadow-2xl mt-6 max-w-[90%] md:max-w-full"
      />
    </div>
  );
}

export default Hero;
