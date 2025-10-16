import React from 'react';
import entrance from "./../assets/et.png";

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-8 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-10">
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 flex items-center gap-3 justify-center md:justify-start">
          Manage Your Events Efficiently
        </h1>
        </div>
      <div className="flex justify-center md:justify-end">
        <img
          src={entrance}
          alt="Event Entrance"
          className="w-full max-w-md rounded-2xl"
        />
      </div>
      </section>
  );
};

export default Hero;
