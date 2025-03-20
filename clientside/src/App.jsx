import {Routes,Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import ChatProvider from "./providers/ChatProvider"
import {Toaster} from "react-hot-toast"
function App() {
  return(
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ProtectedRoute><ChatProvider><HomePage/></ChatProvider></ProtectedRoute>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
