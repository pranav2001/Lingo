import { useContext, useState } from "react"
import ChatContext from "../contexts/ChatContext"
import { Users } from "lucide-react";
import AuthContext from "../contexts/AuthContext";
export default function Sidebar(){
  const {chatState,setSelectedUser}=useContext(ChatContext);
  const {userState}=useContext(AuthContext)
  const [showOnlineOnly,setShowOnlineOnly]=useState(false)
  console.log("Chat state in Sidebar ",chatState)
  const filteredUsers=showOnlineOnly? chatState.users.filter(user=>userState.onlineUsers.includes(user._id)):chatState.users;
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
            <div className="flex items-center gap-2">
                <Users className="size-6" />
                <span className="font-medium hidden lg:block">Contacts</span>
            </div>
            {/* TODO: Online filter toggle*/}
            <div className="mt-3 hidden lg:flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2">
                    <input type="checkbox" checked={showOnlineOnly} onChange={(e)=>setShowOnlineOnly(e.target.checked)} className="checkbox checkbox-sm"/>
                    <span className="text-sm">Show online only</span>
                </label>
                <span className="text-xs text-zinc-500">({userState.onlineUsers.length-1} online)</span>

            </div>
            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user)=>{
                    
                    return <button key={user._id} onClick={()=>setSelectedUser(user)} className={`
                        w-full p-3 flex items-center gap-3
                        hover:bg-base-300 transition-colors
                        ${chatState.selectedUser?._id==user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                      `}>
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic?.url || "/avatar.png"}
                                className="size-12 object-cover rounded-full"
                            />
                            {/* TODO: For online users show a small green circle near the profile pic*/}
                            {userState.onlineUsers.includes(user._id) && (
                                <span
                                className="absolute bottom-0 right-0 size-3 bg-green-500 
                                rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {userState.onlineUsers?.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                })}
            </div>
        </div>
    </aside>
  )
}

