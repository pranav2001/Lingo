import AuthContext from "../contexts/AuthContext"
//import PropTypes from 'prop-types';
import axiosInstance from "../utils/axios";
import {Loader} from "lucide-react"
import { authInitialState, authReducer } from "../reducers/authReducer"
import { useReducer,useEffect } from "react"
//import { useEffect } from "react";
import {io} from "socket.io-client"

const BASE_URL=import.meta.env.MODE=="development"? "http://localhost:5001/api":"/"

export default function AuthProvider({children}){
    const [userState,userDispatch]=useReducer(authReducer,authInitialState)

    useEffect(()=>{
        const fetchUser=async()=>{
            if(localStorage.getItem("Token")){
                try {                
                    const profileData=await axiosInstance.get("/auth/profile",{headers:{Authorization:localStorage.getItem("Token")}});
                    console.log(profileData)
                    
                    //console.log("In Auth Provider testing socket & onlineusers",socket,onlineUsers)
                    userDispatch({type:"authenticateUser",payload:profileData.data.user})

                    // if(userState.isLoggedIn){
                    //     connectSocket("http://localhost:5001");
                    // }
                    //connectSocket("http://localhost:5001",userState)
                    //userDispatch({type:"setSocketAndOnlineUser",payload:{socket,onlineUsers}})
                    // return () => {
                    //     socket.disconnect(); // Cleanup on unmount
                    //   };
                //check the localstorage if isloggedin is true. if yes then proced and if not navigate to 
                } 
                catch (error) {
                    console.log("Please log in",error.message)
                 }
            }
        }
        fetchUser()
        return () => {
            disconnectSocket(); // Cleanup when the component unmounts
        };
    },[])

    // useEffect(() => {
    //     if (userState.isLoggedIn && !userState.socket?.connected) {
    //         connectSocket("http://localhost:5001");
    //     }
    //     // return () => {
    //     //     disconnectSocket(); // Cleanup when the component unmounts
    //     // };
    // }, [userState.isLoggedIn]);
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
    //call this function wthin login,signup,fetchuser(refresh page)
    const connectSocket=(BASE_URL)=>{
        if (userState.socket) {
            userState.socket.disconnect();
          }
        
        // if(userState.socket?.connected){
        //     console.log("Socket already connected...")
        //     return
        // }
        if (!userState.user?._id) {
            console.log("User ID is missing, cannot connect to socket.");
            return;
        }
        console.log("Inside connect Socket",userState.user._id)
        const socket=io(BASE_URL,{
            
            query:{
                userId:userState.user._id
            },
            // transports: ["websocket"],
            // autoConnect:false
            // reconnectionAttempts: 5, // Try reconnecting only 5 times
            // reconnectionDelay: 2000, // Wait 2 seconds between attempts
            // timeout: 5000, // Timeout if the server is not reachable
        })
        socket.connect()
        //.let onlineUsers
        //userDispatch({type:"setSocket",payload:socket})
        socket.on("getOnlineUsers",(userIds)=>{
            console.log("inside getOnlineUsers userIds",userIds)
            //onlineUsers=userIds
            userDispatch({type:"setOnlineUser",payload:{socket,userIds}})
        })



        // return socket
        //userDispatch({type:"setSocket",payload:socket})
    }
    //when you logout
    const disconnectSocket=()=>{
        if(userState.socket?.connected){
            userState.socket.disconnect()
            userDispatch({type:"setSocket",payload:null})
        }
    }
    //refresh page logic after you implement lign
    //if localstorage.getItem("loggedIn") && !userState.user
    if(localStorage.getItem("Token") && !userState.isLoggedIn){
        /*Tailwind classes animate-spin is responsible for the spin
        In your flex items-center justify-center h-screen example:

        flex: Makes the element a flex container.
        justify-center: Centers the items horizontally along the main axis.
        items-center: Centers the items vertically along the cross axis.
        h-screen: Makes the container take up the full screen height, so the centering happens within the entire viewport.*/
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
// Add prop type validation
