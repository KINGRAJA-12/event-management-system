import React, { useEffect, useState } from 'react';
import cc from "../assets/cc.png";
import { useEvent } from '../hooks/useEvent';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { formatDate } from '../config/formatDate';

const Views = () => {
  const { id } = useParams();
  const { fetchEventById, isFetchById, singlEvent, registerEvent, isRegisterToEvent,fetchRegisterUser, isFetchRegisterUser, registerUser } = useEvent();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  useEffect(() => {
    if (id) {
      fetchEventById(id)
      fetchRegisterUser(id);
    };
  }, [id]);
  const handleRegister = async () => {
    if (!name || !email || !number) {
      alert("Please fill all fields before registering!");
      return;
    }
    await registerEvent(id, name, email, number);
    setName('');
    setEmail('');
    setNumber('');
  };
  if (isFetchById||isFetchRegisterUser) {
    return (
      <div className='w-full h-full flex justify-center items-center text-2xl'>
        <ClipLoader size={50} />
      </div>
    );
  }

  if (!singlEvent) {
    return (
      <div className="w-full h-full flex justify-center items-center text-gray-500 text-xl">
        Event not found
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-4 flex flex-col md:flex-row md:items-start items-center justify-center gap-12">
      <div className="flex-1 md:max-w-lg w-full">
        <img 
          src={singlEvent.image} 
          alt="Event Banner" 
          className="w-50 h-50 rounded-xl mb-6"
        />
        <h2 className="text-4xl font-bold text-blue-800 mb-4">{singlEvent.title}</h2>
        <p className="text-gray-700 mb-6">{singlEvent.description}</p>

        <div className="text-gray-700 space-y-2 text-sm md:text-base">
          <p><span className="font-semibold text-blue-800">Address: </span>{singlEvent.location}</p>
          <p><span className="font-semibold text-blue-800">Date: </span>{formatDate(singlEvent.date)}</p>
          <p><span className='font-semibold text-blue-800'>Total Seats: </span>{singlEvent.capacity}</p>
          <p><span className='font-semibold text-blue-800'>Available Seats: </span>{singlEvent.capacity-registerUser.length}</p>
          <p><span className='font-semibold text-blue-800'>Price: </span>₹{singlEvent.price}</p>
        </div>
      </div>
      <div className="flex-1 md:max-w-md w-full  bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register Now</h3>

        <img 
          src={cc} 
          alt="credit card Logo" 
          className="w-52 mx-auto mb-6 opacity-70"
        />

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            onChange={e => setName(e.target.value)}
            value={name}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isRegisterToEvent}
          />
          <input
            type="email"
            placeholder="Enter your email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isRegisterToEvent}
          />
          <input
            type="text"
            placeholder="Enter your number"
            onChange={e => setNumber(e.target.value)}
            value={number}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isRegisterToEvent}
          />
          <button
            type="button"
            disabled={isRegisterToEvent || !name || !email || !number ||number.length !== 10}
            onClick={handleRegister}
            className="mt-4 flex justify-center items-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {isRegisterToEvent ? <ClipLoader size={20} color="white"/> : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Views;
