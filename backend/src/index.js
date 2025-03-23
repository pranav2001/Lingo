import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
import path from "path";
import dotenv from "dotenv"
const __dirname = path.dirname(__filename);;
dotenv.config({})
import express from "express"
import http from "http";
import connectDB from "./configDB/db.js";
import cors from "cors"
import { initializeSocket } from "./sockets/socket.js";
import authRouter from "./routes/auth-route.js";

import messageRouter from "./routes/message-route.js";


const app=express(); 
const server=http.createServer(app);
initializeSocket(server)

const PORT=process.env.PORT;

app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
}))

app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../clientside/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../clientside","dist","index.html"))
    })
}
  
server.listen(PORT,()=>{
    console.log("Server is running on port ",PORT)
    connectDB()
})