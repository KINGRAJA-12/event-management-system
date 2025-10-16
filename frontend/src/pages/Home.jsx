import React from 'react'
import Navbar from '../components/Navbar'
import Login from '../components/Login'
import Register from '../components/Register'
import { useAuth } from '../hooks/useAuth'
import { Outlet } from 'react-router-dom'

const Home = () => {
  let {isLoginModelVis,isRegisterModelVis}=useAuth();
  return (
    <div>
      <Navbar/>
      {isRegisterModelVis&&<Register/>}
      {isLoginModelVis&&<Login/>}
      <Outlet/>

    </div>
  )
}

export default Home
