import bcrypt from "bcrypt";
import { UnauthorizedError } from "../../../../shared/errors/app-error.js";

class CredentialsStrategy {
    constructor(repo) {
        this.repo = repo;
    }

    async execute({email, password}) {
        const user = await this.repo.findUserByEmail(email);

        if (!user) {
            throw new UnauthorizedError("Email or password is invalid");
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );
            console.log(validPassword)
        if (!validPassword) {
            throw new UnauthorizedError("Email or password is invalid");
        }

        return user;
    }
}

export default CredentialsStrategy;