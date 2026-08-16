import axios from "axios"


const api=axios.create({
    baseURL:"http://localhost:8000",
    withCredentials:true,
})

export async function sendMessage({message,chatId}){
    try{
        const response=await api.post("/api/chats/message",{message, chat: chatId});
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function getMessages(){
    try{
        const response=await api.get("/api/chats/");
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}


export async function getChat(chatId){
    try{
        const response=await api.get(`/api/chats/${chatId}`);
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

export async function deleteChat(chatId){
    try{
        const response=await api.delete(`/api/chats/${chatId}`);
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}




//routes on backend
// chatRouter.post("/message",authUser,sendMessage)
// chatRouter.get("/",authUser,getMessages)
// chatRouter.get("/:chatId",authUser,getChat)
// chatRouter.delete("/:chatId",authUser,deleteChat)