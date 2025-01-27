import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
        <h2 className='font-extrabold text-[40px] text-center mt-16 flex-col'>
            <span className='font-extrabold text-[#f56551]'>Discover your next Adventure with AI:</span><br/>
            <span className='font-extrabold text-[20px] text-black '>
            Trip planner with personalized itineraries, tickets, hotels and much more
            </span>
            <br/>

        <p className='text-xs text-gray-500 text-center'>
            Your personal trip planner and curator, creating custom itineraries tailored to your interests and budget. 
        </p>
          <Link to={'/create-trip'}>
            <Button>Get Started for free!</Button>
          </Link>
        </h2>
    </div>
  )
}

export default Hero