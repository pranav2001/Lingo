import { Send } from "lucide-react"
import { useContext, useState } from "react"
import ChatContext from "../contexts/ChatContext"
import toast from "react-hot-toast"

export default function MessageInput(){
    const {sendMessage}=useContext(ChatContext)
    const [text,setText]=useState("")
    const handleSendMessage=async(e)=>{
        e.preventDefault();
        if(!text.trim()){
            return
        }
        try {
            await sendMessage({text:text.trim()})
            setText("")
        } catch (error) {
            console.log("Error while sending msg",error)
            toast.error(error.response.data.message)
        }
    }
    return ( 
        <div className="p-4 w-full"> 
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input type="text" className="w-full input input-bordered rounded-lg input-sm sm:input-md" value={text} onChange={(e)=>setText(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim()}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}