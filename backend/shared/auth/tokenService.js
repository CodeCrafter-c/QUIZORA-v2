import jwt from "jsonwebtoken";
import crypto from "crypto";
import {authConfig} from "../../config/auth.js";

class TokenService {
    generateAccessToken(userId, jti) {
        return jwt.sign(
            { userId, jti },
            authConfig.accessTokenSecret,
            {
                expiresIn: `${authConfig.accessTokenExpiry}m`,
            }
        );
    }

    generateRefreshToken(userId, jti) {
        return jwt.sign(
            { userId, jti },
            authConfig.refreshTokenSecret,
            {
                expiresIn: `${authConfig.refreshTokenExpiry}d`,
            }
        );
    }

    verifyAccessToken(token) {
        return jwt.verify(token, authConfig.accessTokenSecret);
    }

    verifyRefreshToken(token) {
        return jwt.verify(token, authConfig.refreshTokenSecret);
    }

    generateJti() {
        return crypto.randomUUID();
    }

    hashToken(token) {
        return crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }

    compareToken(token, tokenHash) {
        const hashedToken = this.hashToken(token);
        return hashedToken === tokenHash;
    }
}

export default TokenService;