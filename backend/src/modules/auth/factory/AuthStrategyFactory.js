import { BadRequestError } from "../../../../shared/errors/app-error.js";
import CredentialsStrategy from "../strategies/credentialStrategy.js";
import GoogleStrategy from "../strategies/GoogleStrategy.js";

class AuthStrategyFactory {
    constructor(repo) {
        this.strategies = {
            credentials: new CredentialsStrategy(repo),
            google: new GoogleStrategy(repo),
        };
    }

    getStrategy(type) {
        const strategy = this.strategies[type];

        if (!strategy) {
            throw new BadRequestError(
                "Unsupported authentication strategy"
            );
        }

        return strategy;
    }
}

export default AuthStrategyFactory;