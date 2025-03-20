import AuthContext from "../contexts/AuthContext"
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {Loader} from "lucide-react"
import { authInitialState, authReducer } from "../reducers/authReducer"
import { useReducer,useEffect } from "react"
import {io} from "socket.io-client"
import toast from "react-hot-toast";

const BASE_URL=import.meta.env.MODE=="development"? "http://localhost:5001":"/"

export default function AuthProvider({children}){
    const [userState,userDispatch]=useReducer(authReducer,authInitialState)
    const navigate=useNavigate()
    useEffect(()=>{
        const fetchUser=async()=>{
            if(localStorage.getItem("Token")){
                try {                
                    const profileData=await axiosInstance.get("/auth/profile",{headers:{Authorization:localStorage.getItem("Token")}});
                    console.log(profileData)
                    userDispatch({type:"authenticateUser",payload:profileData.data.user})
                } 
                catch (error) {
                    console.log(error.message)
                    localStorage.removeItem("Token")
                    navigate("/login")
                    toast("Please login")
                 }
            }
        }
        fetchUser()
        return () => {
            disconnectSocket();
        };
    },[])
    useEffect(() => {
        const connectIfNeeded = (url) => {
          if (
            userState.isLoggedIn && 
            userState.user?._id &&
            (!userState.socket || !userState.socket.connected)
          ) {
            connectSocket(url);
          }
        };
      
        connectIfNeeded(BASE_URL);
        
        return () => {
          if (userState.socket) {
            disconnectSocket();
          }
        };
      }, [userState.isLoggedIn, userState.user?._id]);
    const connectSocket=(BASE_URL)=>{
        if (userState.socket) {
            userState.socket.disconnect();
          }
        if (!userState.user?._id) {
            console.log("User ID is missing, cannot connect to socket.");
            return;
        }
        console.log("Inside connect Socket",userState.user._id)
        const socket=io(BASE_URL,{
            
            query:{
                userId:userState.user._id
            },

        })
        socket.connect()
        socket.on("getOnlineUsers",(userIds)=>{
            console.log("inside getOnlineUsers userIds",userIds)
            //onlineUsers=userIds
            userDispatch({type:"setOnlineUser",payload:{socket,userIds}})
        })

    }

    const disconnectSocket=()=>{
        if(userState.socket?.connected){
            userState.socket.disconnect()
            userDispatch({type:"setSocket",payload:null})
        }
    }
    if(localStorage.getItem("Token") && !userState.isLoggedIn){
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="size-10 animate-spin"/>
            </div>
        )
    }
    return(
        <AuthContext.Provider value={{userState,userDispatch,connectSocket,disconnectSocket}}>
            {children}
        </AuthContext.Provider>
    )
}

