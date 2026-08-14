import { sendSuccess } from "../../../../shared/responses/response.js";

class AuthController {
    constructor(AuthService) {
        if(!AuthService){
            console.log("this is required")
        }
        this.service = new AuthService()
    }
    async register(req, res, next) {
        try {
            console.log(req.body)
            const user = await this.service.register(req.body)
            return sendSuccess(res, {
                statusCode: 201,
                message: "User registered successfully",
                data: user
            });
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController;