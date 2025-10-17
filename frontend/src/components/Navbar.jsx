import React from 'react';
import event from "./../assets/event.png";
import { Link } from 'react-router-dom';
import { BsBuildingAdd } from "react-icons/bs";
import { RiLoginBoxLine, RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from '../hooks/useAuth';
import { ClipLoader } from 'react-spinners';

const Navbar = () => {
  let {loginModelVis,user,logout,isLogout}=useAuth();
  let handleLogout=async()=>{
    await logout();
  }
  let handleClick=()=>{
    if(!localStorage.getItem("accessToken")&& !localStorage.getItem("refreshToken")){
      loginModelVis();
    }
  }
  return (
    <nav className="w-full h-20 bg-white shadow-lg flex items-center justify-between px-8">
      <Link to="/" className="flex items-center space-x-3">
        <img
          src={event}
          alt="Event Logo"
          className="w-12 h-12 rounded-full border border-gray-300"/>
        <h1 className="md:text-2xl text-md font-semibold text-gray-800">
          Event Management System
        </h1>
      </Link>
      <div className="flex items-center space-x-6 text-gray-700">
        <Link
        onClick={handleClick}
          to="/events"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          <BsBuildingAdd size={20} />
          <span className='md:text-lg text-sm'>Create Event</span>
        </Link>

       {!user&&<button
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition"
          onClick={loginModelVis}>
          <RiLoginBoxLine size={20} />
          <span>Login</span>
        </button>}

        {user&&<button
        disabled={isLogout}
        onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition">
          <RiLogoutBoxRLine size={20} />
          <span>{isLogout?<ClipLoader/>:"Logout"}</span>
        </button>}
      </div>
    </nav>
  );
};

export default Navbar;
