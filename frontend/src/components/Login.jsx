import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { IoClose } from "react-icons/io5";
import { ClipLoader } from 'react-spinners';
const Login = () => {
  const {registerModelVis,closeModels,isLogin,login}=useAuth();
  const [email,setEmail]=useState();
  const [password,setPassword]=useState('');
  const handleLogin=async()=>{
    await login(email,password);
    setEmail('');
    setPassword('');
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-96 p-8 shadow-xl relative">
        <button onClick={closeModels} className='text-2xl font-bold absolute top-5 right-5'><IoClose/></button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        <div className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={e=>setEmail(e?.target?.value)}
            className="border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"/>
          <input 
            type="password" 
            placeholder="Password" 
            onChange={e=>setPassword(e?.target?.value)}
            className="border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"/>
          <button 
          disabled={isLogin || !email || !password}
          onClick={handleLogin}
          className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            {isLogin?<ClipLoader/>:"Login"}
          </button>
        </div>
        <button className="text-sm text-gray-500 mt-6 text-center" onClick={registerModelVis}>
          Don't have an account?
          <span 
            className="text-green-600 hover:underline cursor-pointer font-medium">
            Register
          </span>
        </button>
      </div>
    </div>
  );
};

export default Login;
