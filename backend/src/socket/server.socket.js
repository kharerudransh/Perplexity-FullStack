import { log } from "console";

import {createServer} from "http";
import {Server, Socket} from "socket.io";


let io;

export function initSocket(httpServer){
    io=new Server(httpServer, {
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    })
    io.on("connection",(socket)=>{
        console.log("a user connected"+socket.id)
        
    })
}
export function getIO(){
    if(!io){
        throw new Error("Server not initialized")
    }
    return io
}