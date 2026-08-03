import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
/**
 * @Route:/api/auth/register
 * @Method:POST
 * @Description:register a user
 * @body : {name:"string",dateOfBirth:"string",username:"string",email:"string",password:"string"}
 * @returns 
 */
export async function registerController(req,res){
    const {name,dateOfBirth,username,email,password}= req.body;
    if(!name || !dateOfBirth || !username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const alreadyExist = await userModel.findOne({$or:[{username},{email}]});
    if(alreadyExist){
        return res.status(400).json({
            message:"User already exists",
            success:false,
            err:"User already exists"
        });
    }
    const user =await userModel.create({
        name,
        dateOfBirth,
        username,
        email,
        password
    })
    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity 🎉",
        html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #111827; margin-bottom: 8px;">Welcome to Perplexity, ${name}! 👋</h2>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">
                Thank you for choosing us, <strong>${username}</strong>. We're excited to have you on board.
            </p>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">
                You can now log in to Perplexity using your email or username and password.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">
                If you didn't create this account, please ignore this email.
            </p>
        </div>
        `,
        text: `Welcome to Perplexity, ${name}! You can now log in using your email or username and password.`
    });
    res.status(201).json({
        success:true,
        message:"User created successfully",
    })
}
