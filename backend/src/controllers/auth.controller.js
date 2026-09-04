import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import dotenv from "dotenv";
dotenv.config();
import cookie from "cookie-parser";
import redis from "../config/config.js"
/**
 * @Route:/api/auth/register
 * @Method:POST
 * @Description:register a user
 * @body : {name:"string",dateOfBirth:"string",username:"string",email:"string",password:"string"}
 * @returns 
 */
export async function registerController(req,res){
    try{
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

        //creating token 
        const verifiedToken=jwt.sign({
            id:user._id,
            email:user.email,
        },process.env.JWT_SECRET,{expiresIn:"1d"});
        const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verifiedToken}`;

        await sendEmail({
        to: email,
        subject: "Verify your email — Perplexity",
        html: `
        <div style="font-family: 'Segoe UI', Arial, Helvetica, sans-serif; max-width: 460px; margin: 0 auto; background-color: #0a0a0a; border-radius: 10px; overflow: hidden; border: 1px solid #1f1f1f;">
            
            <div style="height: 3px; background: linear-gradient(90deg, #c0c0c0, #4a4a4a, #c0c0c0);"></div>
            
            <div style="padding: 36px 32px 28px;">
                <p style="color: #6b6b6b; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 20px;">Perplexity</p>
                
                <h2 style="color: #f0f0f0; font-size: 21px; margin: 0 0 6px; font-weight: 600;">Hey ${name},</h2>
                <p style="color: #8a8a8a; font-size: 14px; margin: 0 0 26px; line-height: 1.6;">
                    ${username} is all set — just one step left before you're in.
                </p>
                
                <a href="${verifyLink}""
                style="background-color: #e8e8e8 !important; text-decoration: none !important; padding: 13px 0; border-radius: 6px; display: block; text-align: center;">
                    <span style="color: #0a0a0a !important; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">Verify email →</span>
                </a>
                
                <p style="color: #55555a; font-size: 12px; margin: 20px 0 0; line-height: 1.6;">
                    Link expires in 24 hours. Didn't sign up? Ignore this email.
                </p>
            </div>
            
            <div style="border-top: 1px solid #1a1a1a; padding: 16px 32px; background-color: #070707;">
                <p style="color: #4a4a4a; font-size: 11px; margin: 0;">
                    Once verified, log in with your email or username.
                </p>
            </div>
        </div>
        `,
        text: `Hey ${name}, verify your email to activate your Perplexity account: http://localhost:8000/api/auth/verify-email?token=${verifiedToken}`
    });
        res.status(201).json({
            success:true,
            message:"User created successfully",
        })
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

/**
 * @Route:/api/auth/verify-email
 * @Method:GET
 * @Description:verify a user
 * @query : {token:"string"}
 * @returns 
 */
export async function verifyEmailController(req,res){
    try{
        const{token}=req.query;
        if(!token){
            return res.status(400).json({message:"Token is required"});
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user=await userModel.findOne({email:decode.email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user.verified){
            return res.status(400).json({message:"User already verified"});
        }
        user.verified=true;
        await user.save();

        const loginLink = `${process.env.FRONTEND_URL}/login`;

        await sendEmail({
            to: decode.email,
            subject: "Email verified — Perplexity",
            html: `
            <div style="font-family: 'Segoe UI', Arial, Helvetica, sans-serif; max-width: 460px; margin: 0 auto; background-color: #0a0a0a; border-radius: 10px; overflow: hidden; border: 1px solid #1f1f1f;">
                
                <div style="height: 3px; background: linear-gradient(90deg, #c0c0c0, #4a4a4a, #c0c0c0);"></div>
                
                <div style="padding: 36px 32px 28px;">
                    <p style="color: #6b6b6b; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 20px;">Perplexity</p>
                    
                    <h2 style="color: #f0f0f0; font-size: 21px; margin: 0 0 6px; font-weight: 600;">Email verified!</h2>
                    <p style="color: #8a8a8a; font-size: 14px; margin: 0 0 26px; line-height: 1.6;">
                        Thanks for verifying your email. You can now log in to your Perplexity account.
                    </p>
                    
                    <a href="${loginLink}"
                    style="background-color: #e8e8e8 !important; text-decoration: none !important; padding: 13px 0; border-radius: 6px; display: block; text-align: center;">
                        <span style="color: #0a0a0a !important; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">Log in →</span>
                    </a>
                    
                    <p style="color: #55555a; font-size: 12px; margin: 20px 0 0; line-height: 1.6;">
                        If you didn't sign up, you can safely ignore this email.
                    </p>
                </div>
                
                <div style="border-top: 1px solid #1a1a1a; padding: 16px 32px; background-color: #070707;">
                    <p style="color: #4a4a4a; font-size: 11px; margin: 0;">
                        Welcome to Perplexity.
                    </p>
                </div>
            </div>
            `,
            text: `Email verified! You can now log in to your Perplexity account: ${loginLink}`
        })
        res.status(200).json({message:"Email verified successfully",success:true});
    }
    catch(err){
    if(err.name === "TokenExpiredError" || err.name === "JsonWebTokenError"){
        return res.status(400).json({message:"Invalid or expired verification link"});
    }
    res.status(500).json({message:"Internal server error"});
}
}

/**
 * @Route:/api/auth/login
 * @Method:POST
 * @Description:login a user
 * @body : {email:"string",password:"string"}
 * @returns 
 */
 export async function loginController(req,res){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
            message:"All feilds are required",
            success:false,
            err:"All feilds are required",
            })
        }
        const user=await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                message:"Invalid Credentials",
                success:false,
                err:"Invalid Credentials",
            })
        }
        if(user.verified===false){
            return res.status(400).json({
                message:"Please verify your email",
                success:false,
                err:"Please verify your email",
            })
        }
        const isValidPassword=await user.comparePassword(password);
        if(!isValidPassword){
            return res.status(400).json({
                message:"Invalid Credentials",
                success:false,
                err:"Invalid Credentials",
            })
        }
        ///password is correct now generate cookies
        const token=jwt.sign({
            id:user._id,
            username:user.username,
        },process.env.JWT_SECRET,{
            expiresIn:"5d"
        })

        // token ko cookies me daaldo
       res.cookie("token", token, {
            maxAge: 5 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            message: "Login successfully",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            }
        })
    }
    catch(err)
    {
        res.status(500).json({message:"Internal server error"});
    }
 }


/**
 * @Route:/api/auth/getMe
 * @Method:GET
 * @Description:get current user
 * @headers:{"Authorization":"Bearer <token>"}
 * @returns 
 */
export async function getMecontroller(req,res){
    try{
        const userId=req.user.id;
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false,
                err:"User not found",
            })
        }
        res.status(200).json({
            success:true,
            user,
        })

    }
    catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}


/**
 * @Route:/api/auth/resend-verification-email
 * @Method:POST
 * @Description:resend verification email
 * @body:{email:string}
 */
export async function resendVerificationEmailController(req,res){
    try{
        const {email,password}=req.body;
        if(!email){
            return res.status(400).json({
                message:"Email is required",
                success:false,
                err:"Email is required",
            })
        }
        if(!password){
            return res.status(400).json({
                message:"Password is required",
                success:false,
                err:"Password is required",
            })
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"User dosen't exist",
                success:false,
                err:"User dosen't exist",
            })
        }
        const isValidPassword=await user.comparePassword(password);
        if(!isValidPassword){
            return res.status(400).json({
                message:"Invalid Credentials",
                success:false,
                err:"Invalid Credentials",
            })
        }
        if(user.verified){
            return res.status(400).json({
                message:"User already verified",
                success:false,
                err:"User already verified",
            })
        }

        const verificationToken=jwt.sign({
            id:user._id,
            email:user.email
        },process.env.JWT_SECRET,{expiresIn:"1h"})
        const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verifiedToken}`;
        await sendEmail({
        to: email,
        subject: "Verify your email — Perplexity",
        html: `
        <div style="font-family: 'Segoe UI', Arial, Helvetica, sans-serif; max-width: 460px; margin: 0 auto; background-color: #0a0a0a; border-radius: 10px; overflow: hidden; border: 1px solid #1f1f1f;">
            
            <div style="height: 3px; background: linear-gradient(90deg, #c0c0c0, #4a4a4a, #c0c0c0);"></div>
            
            <div style="padding: 36px 32px 28px;">
                <p style="color: #6b6b6b; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 20px;">Perplexity</p>
                
                <h2 style="color: #f0f0f0; font-size: 21px; margin: 0 0 6px; font-weight: 600;">Hey ${user.name},</h2>
                <p style="color: #8a8a8a; font-size: 14px; margin: 0 0 26px; line-height: 1.6;">
                    ${user.username} is all set — just one step left before you're in.
                </p>
                
                <a href="${verifyLink}""
                style="background-color: #e8e8e8 !important; text-decoration: none !important; padding: 13px 0; border-radius: 6px; display: block; text-align: center;">
                    <span style="color: #0a0a0a !important; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">Verify email →</span>
                </a>
                
                <p style="color: #55555a; font-size: 12px; margin: 20px 0 0; line-height: 1.6;">
                    Link expires in 1 hour. Didn't sign up? Ignore this email.
                </p>
            </div>
            
            <div style="border-top: 1px solid #1a1a1a; padding: 16px 32px; background-color: #070707;">
                <p style="color: #4a4a4a; font-size: 11px; margin: 0;">
                    Once verified, log in with your email or username.
                </p>
            </div>
        </div>
        `,
        text: `Hey ${user.name}, verify your email to activate your Perplexity account: http://localhost:8000/api/auth/verify-email?token=${verificationToken}`
    });
        res.status(201).json({
            success:true,
            message:"Verification mail sent successfully",
        })

        
        
    }
    catch (err){
        console.log("Error in resending verification email",err);
        res.status(500).json({message:"Internal server error"});
    }
}
/**
 * @Route:/api/auth/logout
 * @Method:GET
 * @Description:logout a user
 * @headers:{"Authorization":"Bearer <token>"}
 * @returns 
 */
export async function logoutController(req,res){
    try{
        const token=req.cookies.token;
        res.clearCookie("token");
        if(!token){
            return res.status(400).json({
                message:"No token found",
                success:false,  
                err:"No token found",
            })
        }
        const isBlackListed=await redis.get(token)
        if(isBlackListed){
            return res.status(400).json({
                message:"Invalid User",
                success:false,
                err:"Invalid User",
            })
        }
        //token ko blacklist me daaldo
        await redis.set(token, Date.now().toString());
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }
    catch(err){
        console.log("Error in logout",err);
        res.status(500).json({message:"Internal server error"});
    }
}
 