import { Router } from "express";
import {registerController ,verifyEmailController,loginController,getMecontroller,logoutController,resendVerificationEmailController} from "../controllers/auth.controller.js"
import {registerValidation,loginValidation,emailValidation} from "../validation/registerValidation.js"
import {authUser} from "../middleware/auth.middleware.js"
const authRouter = Router();



/**
 * @Route:/api/auth/register
 * @Method:POST
 * @Description:register a user
 */
authRouter.post("/register",registerValidation,registerController)


/**
 * @Route:/api/auth/login
 * @Method:POST
 * @Description:login a user
 */
authRouter.post("/login",loginValidation,loginController)

/**
 * @Route:/api/auth/verify-email
 * @Method:GET
 * @Description:verify a user
 */
authRouter.get("/verify-email",verifyEmailController)


/**
 * @Route:/api/auth/getMe
 * @Method:GET
 * @Description:get current user
 * @headers:{"Authorization":"Bearer <token>"}
 * @returns 
 */
authRouter.get("/getMe",authUser,getMecontroller)


/**
 * @Route:/api/auth/resend-verification-email
 * @Method:POST
 * @Description:resend verification email
 * @body:{email:"string"}
 */
authRouter.post("/resend-verification-email",emailValidation,resendVerificationEmailController)

authRouter.get("/logout",authUser,logoutController)    






export default authRouter;