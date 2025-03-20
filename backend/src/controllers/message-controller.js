import User from "../models/user-model.js";
import Message from "../models/message-model.js";
import { getReceiverSocketId,getIo } from "../sockets/socket.js";
const messageCtrl={}

messageCtrl.getUsersForSidebar=async(req,res)=>{
    try {
        const loggedInUser=req.currentUser.userId;
        const users=await User.find({_id:{$ne:loggedInUser}})
        res.status(200).json({users});

    } catch (error) {
        console.log("Error in getUsersForSidebar controller:",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}

messageCtrl.getMessages=async(req,res)=>{
    try {
        const {id:otherUserId}=req.params;
        const myId=req.currentUser.userId;
        const messages=await Message.find({
            $or:[{senderId:myId,receiverId:otherUserId},
                {senderId:otherUserId,receiverId:myId}
            ]
        })
        res.status(200).json({messages})
    } catch (error) {
        console.log("Error in getMessages controller:",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}

messageCtrl.sendMessage=async(req,res)=>{
    try {
        const {text}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.currentUser.userId;
        const message= await Message.create({senderId,receiverId,text})
        const io=getIo()
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",message)
        }
        res.status(201).json({message});
    } catch (error) {
        console.log("Error in sendMessage controller:",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}


export default messageCtrl;