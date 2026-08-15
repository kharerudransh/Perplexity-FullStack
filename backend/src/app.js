import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";

const app = express()

//Middleware
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    
}))

//Api Routes
app.use('/api/auth',authRouter);
app.use('/api/chats',chatRouter);


export default app