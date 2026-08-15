import { googleClient } from "../../../../config/google.js";
import { UnauthorizedError } from "../../../../shared/errors/app-error.js";

class GoogleStrategy {
    constructor(repo) {
        this.repo = repo;
    }

    async execute({ code }) {
        const { tokens } = await googleClient.getToken(code);

        if (!tokens.id_token) {
            throw new UnauthorizedError("Google authentication failed");
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.sub || !payload.email) {
            throw new UnauthorizedError("Invalid Google account");
        }

        // Find existing user
        let user = await this.repo.findUserByEmail(payload.email);

        if (user) {
            // Don't automatically link Google to another
            // authentication provider.
            if (user.provider !== "google") {
                throw new UnauthorizedError(
                    "An account already exists with this email"
                );
            }

            return user;
        }
        console.log(payload)
        // Create new Google user
        user = await this.repo.createUser({
            email: payload.email,
            firstName: payload.given_name ?? null,
            lastName: payload.family_name ?? null,
            provider: "google",
            providerId: payload.sub,
            password: null,
        });

        return user;
    }
}

const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
});

console.log(url);
export default GoogleStrategy;