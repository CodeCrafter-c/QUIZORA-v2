import database from "../../../../shared/db/prisma.js";

class AuthRepository{
    constructor(){
        this.client = database.getClient()
    }

    // find user by id
    async findUserById(id){
        return await this.client.user.findUnique({
            where: { id }
        })
    }

    // find user by email
    async findUserByEmail(email){
        return await this.client.user.findUnique({
            where: { email }
        })
    }

    // create User
    async createUser(userData){
        return await this.client.user.create({
            data: userData
        })
    }

    // create session
    async createSeesion(){
    }

    // find sessionByID
    async findSessionById(){

    }

    // update
    async updateSession(){

    }

    // revoke
    async revokeSession(){

    }
}

export default AuthRepository;