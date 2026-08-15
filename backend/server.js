import dotenv from "dotenv";
dotenv.config();

import {initSocket} from "./src/socket/server.socket.js"
import http from "http"


import app from "./src/app.js";
import connectToDb from "./src/config/database.js";


const httpServer = http.createServer(app);
initSocket(httpServer);



connectToDb()


httpServer.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})