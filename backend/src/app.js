import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express()

//Middleware
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    
}))

//Api Routes
app.use('/api/auth',authRouter);
app.use('/api/chats',chatRouter);


export default app