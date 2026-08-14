import { Router } from "express";
import AuthController from "../controller/authController.js";
import validate from "../middleware/validate.js";
import { registerSchema } from "../validation/register.js";
import AuthService from "../service/authService.js";

const authRouter=Router()

const authController=new AuthController(AuthService)


authRouter.post("/register",validate(registerSchema),(req,res,next)=>{
    authController.register(req,res,next);
})

export default authRouter;
