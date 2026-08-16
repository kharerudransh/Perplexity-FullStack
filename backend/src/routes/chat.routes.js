import {Router} from "express"
import {authUser} from "../middleware/auth.middleware.js"
import {sendMessage,getMessages,getChat,deleteChat} from "../controllers/chat.controller.js"

const chatRouter = Router();

chatRouter.post("/message",authUser,sendMessage)
chatRouter.get("/",authUser,getMessages)
chatRouter.get("/:chatId",authUser,getChat)
chatRouter.delete("/:chatId", authUser, deleteChat);
export default chatRouter
