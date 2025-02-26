// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import {Routes,Route, Navigate} from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
//import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import ChatProvider from "./providers/ChatProvider"
import { useContext } from "react"
import AuthContext from "./contexts/AuthContext"
import {Toaster} from "react-hot-toast"
function App() {
  const {userState} = useContext(AuthContext);
  //console.log("onlineUsers test in appjs",userState?.onlineUsers)
  return(
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ProtectedRoute><ChatProvider><HomePage/></ChatProvider></ProtectedRoute>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        {/*<Route path="/settings" element={<SettingsPage/>} />*/}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
