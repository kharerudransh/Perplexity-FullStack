import jwt from "jsonwebtoken";
import redis from "../config/config.js"
import dotenv from "dotenv";
dotenv.config();

//This middleware is used to check user has token or not , if user has token means user is logged in and can access the features 
export async function authUser(req,res,next){
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(400).json({
                message:"Token is required",
                success:false,
                err:"Token not found",
            })
        }
        const isBlackListed = await redis.get(token);
        if (isBlackListed) {
            return res.status(401).json({
                message: "Invalid Token"
            })
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        req.user= decode;
        next();
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}
