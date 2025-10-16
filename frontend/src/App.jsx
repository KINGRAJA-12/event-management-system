import React, { useEffect } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import Views from './pages/Views'
import Event from './components/Event'
import Report from './pages/Report'
import { ClipLoader } from 'react-spinners'
import { useAuth } from './hooks/useAuth'
import PrivateRoutes from './components/PrivateRoutes'

const App = () => {
  const {getme,isGetme}=useAuth();
  useEffect(()=>{
    getme();
  },[])
  if(isGetme)
    return <><div className="w-full h-screen flex justify-center items-center text-4xl font-semibold">
          <ClipLoader/>
        </div></>
  return (
    <Routes>
      <Route path='/' element={<Home/>}>
      <Route index element={<HomePage/>}/>
      <Route path='view-event/:id' element={<Views/>}/>
      <Route path='events' element={<PrivateRoutes><Event/></PrivateRoutes>}/>
      <Route path='report/:id' element={<PrivateRoutes><Report/></PrivateRoutes>}/>
      </Route>
    </Routes>
  )
}

export default App
