    import userModel from "../models/user.model.js";
    import {generateResponse, generateChatTitle} from "../services/ai.service.js";
    import chatModel from "../models/chat.model.js";
    import messageModel from "../models/message.model.js";

    export async function sendMessage(req,res){
        const {message ,chat:chatId}=req.body;
        const userName=req.user.username;
        

        let chatTitle="";
        let chat=null;
        if(!chatId){
            chatTitle = await generateChatTitle(message);
            chat = new chatModel.create({
                user:req.user.id,
                title:chatTitle,
            });
            chatId=chat._id;
        }
        const userMessage=await messageModel.create({
            chat: chatId || chat._id,
            content:message,
            role:"user",
        });
        
        const messages=await messageModel.find({chat:chatId});
        const result = await generateResponse(messages,userName);

        
        const aiMessage=await messageModel.create({
            chat:chat._id,
            content:result,
            role:"ai",
        });

        res.status(201).json({
            response:result,
            ChatTitle:chatTitle ,
            chat:chat,
            userMessage:userMessage,
            aiMessage:aiMessage,
        });
        
    }

    export async function getMessages(req,res){
        const userId = req.user.id;
        const chats = await chatModel.find({ user: userId });
        res.status(200).json({
            chats,
        });
    }
    
    export async function getChat(req,res){
        
        const chatid=req.params.chatId;
        const chat=await chatModel.findOne({
            _id:chatid,
            user:req.user.id,
        })
        if(!chat){
            return res.status(404).json({
                message:"Chat not found",
            });
        }
        res.status(200).json({
            chat,
        });
    }

    export async function deleteChat(req,res){
        try {
            const chatId=req.params.chatId;
            const chat = await chatModel.findOneAndDelete({
                _id: chatId,
                user: req.user.id,
            });
            if(!chat){
                return res.status(404).json({
                    message:"Chat not found",
                });
            }
            await messageModel.deleteMany({chat:chatId});
            res.status(200).json({
                message:"Chat deleted successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:"Internal server error",
            });
        }
    }