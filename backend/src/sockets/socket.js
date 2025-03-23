import { Server } from "socket.io";

let io;
const onlineUsers={}

export const getReceiverSocketId=(userId)=>{
    return onlineUsers[userId]
}

export const initializeSocket=(server)=>{
    io=new Server(server,{
        cors:{origin:"http://localhost:5173"}
    })

    io.on("connection",(socket)=>{
        console.log("User connected",socket.id)
        const userId=socket.handshake.query.userId
        if(userId){
           onlineUsers[userId]=socket.id 
        }
        io.emit("getOnlineUsers",Object.keys(onlineUsers))
        socket.on("disconnect",()=>{
            console.log("User disconnected ",socket.id)
            delete onlineUsers[userId]
            io.emit("getOnlineUsers",Object.keys(onlineUsers))
        })
    })
    return io
}

export const getIo=()=>{
    if(!io){
        throw new Error("Socket.io not initialized!")
    }
    return io;
};