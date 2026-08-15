import TokenService from "../auth/tokenService.js";
import AuthRepository from "../../src/modules/auth/repository/AuthRepository.js";
import { UnauthorizedError } from "../errors/app-error.js";
import {
    accessTokenCookie,
    refreshTokenCookie
} from "../../config/cookie.js";

const authRepository = new AuthRepository();
const tokenService = new TokenService();

const authenticate = async function (req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new UnauthorizedError("Unauthorized");
        }

        let decodedToken;

        try {
            decodedToken = tokenService.verifyAccessToken(accessToken);
            
            req.user = decodedToken;
            return next();

        } catch (error) {
            // Only continue to refresh if access token expired
            if (error.name !== "TokenExpiredError") {
                throw new UnauthorizedError("Invalid access token");
            }
        }

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedError("Unauthorized");
        }
        let decodedRefreshToken;

        try {
            decodedRefreshToken = tokenService.verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new UnauthorizedError("Invalid or expired refresh token");
        }
        const session = await authRepository.findSessionByJti(
            decodedRefreshToken.jti
        );

        if (!session || session.revokedAt) {
            throw new UnauthorizedError("Invalid session");
        }

        const validRefreshToken =
            tokenService.compareToken(
                refreshToken,
                session.refreshTokenHash
            );

        if (!validRefreshToken) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        // Rotate tokens
        const newJti = tokenService.generateJti();

        const newAccessToken =
            tokenService.generateAccessToken(
                decodedRefreshToken.userId,
                newJti
            );

        const newRefreshToken =
            tokenService.generateRefreshToken(
                decodedRefreshToken.userId,
                newJti
            );

        const newRefreshTokenHash =
            tokenService.hashToken(newRefreshToken);

        await authRepository.updateSession(session.id, {
            jti: newJti,
            refreshTokenHash: newRefreshTokenHash,
        });

        res.cookie(
            "accessToken",
            newAccessToken,
            accessTokenCookie
        );

        res.cookie(
            "refreshToken",
            newRefreshToken,
            refreshTokenCookie
        );

        req.user = {
            userId: decodedRefreshToken.userId,
            jti: newJti,
        };

        next();

    } catch (error) {
        next(error);
    }
};

export default authenticate;