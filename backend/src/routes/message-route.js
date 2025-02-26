import { Router } from "express";
import messageCtrl from "../controllers/message-controller.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const messageRouter=Router()

messageRouter.get("/users",authenticateUser,messageCtrl.getUsersForSidebar);
messageRouter.get("/:id",authenticateUser,messageCtrl.getMessages);
messageRouter.post("/send/:id",authenticateUser,messageCtrl.sendMessage)

export default messageRouter;