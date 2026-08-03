import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
const app = express()

//Middleware

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

//Api Routes
app.use('/api/auth',authRouter);

export default app