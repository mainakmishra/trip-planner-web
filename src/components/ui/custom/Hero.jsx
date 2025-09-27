import React from 'react';
import { Button } from '../button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 md:px-16 lg:px-56 py-16 relative overflow-hidden"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >


      <motion.div
        className="flex flex-col items-center justify-center mt-24 md:mt-32 lg:mt-40 z-10"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 60 }}
      >
        <h2 className="font-extrabold text-[40px] md:text-[50px] text-center flex flex-col gap-2">
          <motion.span
            className="font-extrabold text-yellow-300 text-4xl md:text-5xl drop-shadow-2xl"
            style={{ color: '#001F3F' }} // Darkened font color
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Discover Your Next Adventure with <span className="text-pink-300">AI</span>
          </motion.span>
          <motion.span
            className="font-semibold text-[20px] md:text-[24px] text-blue-100 drop-shadow-2xl"
            style={{ color: '#003366' }} // Darkened font color
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Trip planner with personalized itineraries, tickets, hotels, and much more
          </motion.span>
          <motion.p
            className="text-base md:text-lg text-indigo-100 text-center mt-3 max-w-3xl mx-auto drop-shadow-2xl"
            style={{ color: '#B0E2FF' }} // Reverted to previous color
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Your personal trip planner and curator, creating custom itineraries tailored to your interests, style, and budget.
          </motion.p>
          <Link to="/create-trip" className="mt-6">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button className="text-white bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 transition duration-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl">
                Get Started for Free!
              </Button>
            </motion.div>
          </Link>
        </h2>
      </motion.div>

      <motion.img
        src="/landing2.png"
        alt="Travel illustration"
        className="rounded-2xl shadow-2xl mt-6 max-w-[90%] md:max-w-full z-10 border-4 border-white/30"
        style={{ backdropFilter: 'blur(3px) brightness(70%)' }}
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}    
        transition={{ duration: 0.8, delay: 1.1, type: 'spring', stiffness: 80 }}
      />
    </motion.div>
  );
}

export default Hero;