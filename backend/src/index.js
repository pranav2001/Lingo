import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv"
const __dirname = path.resolve();//path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env')})
import express from "express"// handling http requests
import http from "http";
//import {Server} from "socket.io" //import socketio server to manage websocket connection
import connectDB from "./configDB/db.js";
//import {app,server} from "./utils/socket.js"
import cors from "cors"
import { initializeSocket } from "./sockets/socket.js";
//import cookieParser from "cookie-parser";
import authRouter from "./routes/auth-route.js";

import messageRouter from "./routes/message-route.js";


const app=express(); // for handling req
const server=http.createServer(app);// socket io doesnt directly attach to express it needs an http server, so this line wraps the express app inside raw http server. This lets both websockets and http req to work together
initializeSocket(server)
//creates a new socketio server instance, and attaches it to our http server allowing clients to connect using websockets
const PORT=process.env.PORT;

app.use(express.json())
//app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../clientside/dist")))//serve static file
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../clientside","dist","index.html"))// if you go to any other url other than the ones /api's you will serve the index.html within the dist file
    })
}
  
server.listen(PORT,()=>{
    console.log("Server is running on port ",PORT)
    connectDB()
})//starts the server


//So socketio {Server} is a server that manages websockets
//socketio doesnt directly attach to express so you will need an http server
//So http.createServer(app) will create an http server and wrap the express app. Instead of express directly handling req, http acts as a middleman and forwards incoming http req to express
//express is only an http req handler and websocket requries a lower level http server to keep the connection open
//Create a instance of socketio server and attach it to http server
//io.on("connection", callback) runs when a new client connects.It creates a new socket object for that client.This event fires only once per client when they first connect.whenever a new client connects the io.on fires and the callback func associated with it gets executed. socket parameter represents a unique connection from a user.. all this is done so to detect when a new user joins
//socket.on("disconnect") this fires when a client disconnects ->closes browser tab etc.
//server.listen -> will start the http+websocket server

//socket.on("message", (data) => {    console.log("Received message:", data);}); It listens for a specific event (e.g., "message") from a particular client. Each client has their own socket, so socket.on() handles individual client messages.

