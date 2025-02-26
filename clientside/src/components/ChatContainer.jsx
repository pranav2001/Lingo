import { useContext, useEffect, useRef } from "react"
import AuthContext from "../contexts/AuthContext"
import ChatContext from "../contexts/ChatContext"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import convertToMsgTime from "../utils/msgTime"

export default function ChatContainer(){
    const{chatState,getSelecterUserMessages,subscribeRealTimeMsgs,unsubscribeRealTimeMsgs}=useContext(ChatContext)
    const {userState}=useContext(AuthContext)
    const messageEndRef=useRef(null)
    useEffect(()=>{
        getSelecterUserMessages(chatState.selectedUser._id)
        subscribeRealTimeMsgs()
        return ()=>{
            unsubscribeRealTimeMsgs()
        }
    },[chatState.selectedUser._id,chatState.socket])


    useEffect(()=>{
        if(messageEndRef.current && chatState.messages){
            messageEndRef.current.scrollIntoView({behaviour:"smooth"})
        }
    },[chatState.messages])
    console.log(chatState.messages)
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatState.messages.map((message)=>(
                    <div key={message._id} className={`chat ${message.senderId==userState.user._id ? "chat-end":"chat-start"}`} ref={messageEndRef}>
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={message.senderId==userState.user._id? userState.user?.profilePic?.url||"/avatar.png" : chatState.selectedUser?.profilePic?.url || "/avatar.png"}/>
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {convertToMsgTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex">
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput/>
        </div>
    )
}