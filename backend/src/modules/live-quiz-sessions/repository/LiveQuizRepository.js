import database from "../../../../shared/db/prisma.js";

class LiveQuizRepository {

    constructor() {
        this.client = database.getClient()
    }
    // create live quiz session 
    async createLiveQuizSession(liveQuizSessionData) {
        return await this.client.liveQuizSession.create({
            data: liveQuizSessionData,
        });
    }

    // find by join code 
    async findByJoinCode(joinCode) {
        return await this.client.liveQuizSession.findUnique({
            where: { joinCode },
        });
    }

    async findSessionById(sessionId) {
        return await this.client.liveQuizSession.findUnique({
            where: { id: sessionId },
        });
    }
    async updateLiveQuizSession(id, data) {
        return await this.client.liveQuizSession.update({
            where: { id },
            data,
        });
    }

    async findActiveSessionByQuizId(quizId) {
        return await this.client.liveQuizSession.findFirst({
            where: {
                quizId,
                status: { in: ["WAITING", "LIVE"] },
            },
        });
    }
}

export default LiveQuizRepository;