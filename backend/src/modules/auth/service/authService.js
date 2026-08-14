import { ConflictError,InternalServerError } from "../../../../shared/errors/app-error.js";
import AuthRepository from "../repository/AuthRepository.js";

class AuthService{
    constructor(){
        this.repo = new AuthRepository()
    }
    async register(userData) {
        const existingUser = await this.repo.findUserByEmail(userData.email);

        if (existingUser) {
            throw new ConflictError("Email already exists.");
        }

        const user = await this.repo.createUser(userData);

        if (!user) {
        throw new InternalServerError("Failed to create user.");
        }

        // TODO: send email after creation, background work
        return user;
        }
}

export default AuthService;