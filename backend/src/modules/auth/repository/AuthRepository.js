import database from "../../../../shared/db/prisma.js";

class AuthRepository {
    constructor() {
        this.client = database.getClient()
    }

    // find user by id
    async findUserById(id) {
    return await this.client.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

    // find user by email
    async findUserByEmail(email) {
        return await this.client.user.findUnique({
            where: { email }
        })
    }

    // create User
    async createUser(userData) {
    return await this.client.user.create({
        data: userData,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

    // create session
    async createSession(sessionData) {
        return await this.client.session.create({
            data: sessionData,
        });
    }

    // find session by ID
    async findSessionById(id) {
        return await this.client.session.findUnique({
            where: { id },
        });
    }

    

    // update session
    async updateSession(id, data) {
        return await this.client.session.update({
            where: { id },
            data,
        });
    }

    // revoke session
    async revokeSession(id) {
        return await this.client.session.update({
            where: { id },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}

export default AuthRepository;