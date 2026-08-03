import { Router } from "express";
import {registerController} from "../controllers/auth.controller.js"
import {registerValidation} from "../validation/registerValidation.js"
const authRouter = Router();



/**
 * @Route:/api/auth/register
 * @Method:POST
 * @Description:register a user
 */
authRouter.post("/register",registerValidation,registerController)







export default authRouter;