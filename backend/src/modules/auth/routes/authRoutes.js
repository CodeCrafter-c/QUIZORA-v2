import { Router } from "express";
import AuthController from "../controller/authController.js";
import validate from "../../../../shared/middlewares/validate.js";
import { registerSchema } from "../validation/register.js";
import { credentialLoginSchema, googleLoginSchema } from "../validation/login.js";
import AuthService from "../service/authService.js";

const authRouter = Router()
const authService = new AuthService()
const authController = new AuthController(authService)


authRouter.post("/register", validate(registerSchema, "body"), (req, res, next) => {
    authController.register(req, res, next);
})
authRouter.post("/login", validate(credentialLoginSchema, "body"), (req, res, next) => {
    authController.login(req, res, next);
})
authRouter.get("/google/callback", validate(googleLoginSchema, "query"), (req, res, next) => {
    authController.googleCallback(req, res, next);
})
export default authRouter;
