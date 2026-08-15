import { sendSuccess } from "../../../../shared/responses/response.js";
import { accessTokenCookie, refreshTokenCookie } from "../../../../config/cookie.js";
class AuthController {
    constructor(AuthService) {
        if (!AuthService) {
            console.log("this is required")
        }
        this.service = AuthService
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
    async login(req, res, next) {
        try {
            const userData = {
                ...req.body,
                ...req.query
            };

            await this.handleLogin(userData, res);

        } catch (error) {
            next(error);
        }
    }

    async googleCallback(req, res, next) {
        try {
            
            await this.handleLogin(
                {
                    type: "google",
                    ...req.query
                },
                res
            );

        } catch (error) {
            next(error);
        }
    }

    async handleLogin(userData, res) {
        const loginUser = await this.service.login(userData);

        res.cookie(
            "accessToken",
            loginUser.accessToken,
            accessTokenCookie
        );

        res.cookie(
            "refreshToken",
            loginUser.refreshToken,
            refreshTokenCookie
        );

        return sendSuccess(res, {
            statusCode: 200,
            message: "User logged in successfully",
            data: {
                user: loginUser.user
            }
        });
    }
}


export default AuthController;