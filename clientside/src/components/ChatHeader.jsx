import {useContext} from "react"
import ChatContext from "../contexts/ChatContext"
import { X } from "lucide-react"
import AuthContext from "../contexts/AuthContext"
export default function ChatHeader(){
    const {chatState,setSelectedUser}= useContext(ChatContext)
    const{userState}=useContext(AuthContext)
    return(
            <div className="p-2.5 border-b border-base-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         {/* Avatar */}
                        <div className="avatar">
                            <div className="size-10 rounded-full relative">
                                <img src={chatState.selectedUser?.profilePic?.url || "/avatar.png"}/>
                            </div>
                        </div>
                         {/* User info */}
                        <div>
                            <h3 className="font-medium">{chatState.selectedUser?.fullName}</h3>
                            <p className="text-sm text-base-content/70">
                                {userState.onlineUsers.includes(chatState.selectedUser._id) ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                     {/* Close button */}
                    <button onClick={() => setSelectedUser(null)}>
                        <X />
                    </button>
                    </div>
                </div>
    )
}