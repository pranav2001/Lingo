import ChatContext from "../contexts/ChatContext";
import { chatInitalState,chatReducer } from "../reducers/chatReducer";
import { useContext, useReducer, useState } from "react";
import axiosInstance from "../utils/axios";
import { Loader } from "lucide-react";
import toast from "react-hot-toast"
import AuthContext from "../contexts/AuthContext";
export default function ChatProvider({children}){
    const [chatState,chatDispatch]=useReducer(chatReducer,chatInitalState);
    const {userState}=useContext(AuthContext)
    useState(()=>{
        const fetchUsers=async()=>{
            if(!chatState.isUsersLoading){
                try {
                    const allUsers=await axiosInstance.get("/messages/users",{headers:{Authorization:localStorage.getItem("Token")}})
                    console.log(allUsers)
                    chatDispatch({type:"setAllUsers",payload:allUsers.data.users})
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }
        fetchUsers()
    },[])
    const setSelectedUser=(user)=>{
        chatDispatch({type:"setSelectedUser",payload:user})
    }
    const getSelecterUserMessages=async(userId)=>{
        try {
            const messagesResponse=await axiosInstance.get(`/messages/${userId}`,{headers:{Authorization:localStorage.getItem("Token")}})
            console.log(messagesResponse)
            chatDispatch({type:"setSelectedUserMsgs",payload:messagesResponse.data.messages})
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }

    }

    const sendMessage=async(messageData)=>{
        try {
            const msgResponse=await axiosInstance.post(`/messages/send/${chatState.selectedUser._id}`,messageData,{headers:{Authorization:localStorage.getItem("Token")}})
            console.log("Sent msg ",msgResponse);
            chatDispatch({type:"addMessage",payload:msgResponse.data.message})
        } catch (error) {
            console.log("Error at sendMessage",error)
            toast.error(error.response.data.message)
        }
    }

    const subscribeRealTimeMsgs=()=>{
        if(!chatState.selectedUser){
            return
        }
        const socket=userState.socket;
        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId!==chatState.selectedUser._id){
                return
            }

            chatDispatch({type:"addMessage",payload:newMessage})
        })

    }

    const unsubscribeRealTimeMsgs=()=>{
        const socket=userState.socket;
        socket.off("newMessage")
    }

    if(!chatState.isUsersLoading){
        return (
            <div className="flex justify-center items-center h-screen">
            <Loader className="size-10 animate-spin"/>
            </div>
        )
    }
    return(
        <ChatContext.Provider value={{chatState,chatDispatch,setSelectedUser,getSelecterUserMessages,sendMessage,subscribeRealTimeMsgs,unsubscribeRealTimeMsgs}}>
                {children}
        </ChatContext.Provider>
    )
    
}