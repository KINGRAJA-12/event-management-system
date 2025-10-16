import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { IoClose } from "react-icons/io5";
import { ClipLoader } from 'react-spinners';
const Register = () => {
  const {loginModelVis,closeModels,register,isRegister}=useAuth();
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const handleRegister=async()=>{
    await register(name,email,password);
    setName('')
    setEmail('')
    setPassword('')
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-96 p-8 shadow-xl relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
                <button onClick={closeModels} className='text-2xl font-bold absolute top-5 right-5'><IoClose/></button>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            onChange={e=>setName(e?.target?.value)}
            className="border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <input 
            type="email" 
            placeholder="Email"
            onChange={e=>setEmail(e?.target?.value)}
            className="border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={e=>setPassword(e?.target?.value)}
            className="border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button 
          disabled={isRegister || !name || !email || !password}
          onClick={handleRegister}
          className="px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
           {isRegister?<ClipLoader/>:"Register"}
          </button>
        </div>
        <button className="text-sm text-gray-500 mt-6 text-center" onClick={loginModelVis}>
          Already have an account?
          <span 
            className="text-blue-600 hover:underline cursor-pointer font-medium">
            Login
          </span>
        </button>
      </div>
    </div>
  );
};

export default Register;
