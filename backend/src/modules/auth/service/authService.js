import { ConflictError, InternalServerError } from "../../../../shared/errors/app-error.js";
import AuthRepository from "../repository/AuthRepository.js";
import AuthStrategyFactory from "../factory/AuthStrategyFactory.js";
import TokenService from "../../../../shared/auth/tokenService.js";
import { authConfig } from "../../../../config/auth.js";
import bcrypt from "bcrypt";

class AuthService {
    constructor() {
        this.repo = new AuthRepository()
    }
    async register(userData) {
        const existingUser = await this.repo.findUserByEmail(userData.email);

        if (existingUser) {
            throw new ConflictError("Email already exists.");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = await this.repo.createUser({
            ...userData,
            password: hashedPassword,
        });

        if (!user) {
            throw new InternalServerError("Failed to create user.");
        }

        return user;
    }

    async login(userData) {
        const type = userData.type;
        const factory = new AuthStrategyFactory(this.repo);
        const tokenService = new TokenService();
        const strategy = factory.getStrategy(type);
        const user = await strategy.execute(userData);
        const jti = tokenService.generateJti();
        const accessToken = tokenService.generateAccessToken(user.id, jti);
        const refreshToken = tokenService.generateRefreshToken(user.id, jti);
        const expiresAt = new Date(
            Date.now() +
            Number(authConfig.refreshTokenExpiry) * 24 * 60 * 60 * 1000
        );

        const refreshTokenHash = tokenService.hashToken(refreshToken);

        const session = await this.repo.createSession({
            userId: user.id,
            jti,
            refreshTokenHash,
            expiresAt,
        });

        // TODO : cache sessionData to redis 

        // set token here , or in controller?
        return {
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                gender: user.gender,
                email: user.email,
            },
            accessToken,
            refreshToken,
            session,
        };

    }
}

export default AuthService;