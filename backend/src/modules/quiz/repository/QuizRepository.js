import database from "../../../../shared/db/prisma.js";
class QuizRepository {

    constructor() {
        this.client = database.getClient()
    }

    //get quiz by id
    async getQuizById(id) {
        return await this.client.quiz.findUnique({
            where: { id },
        });
    }

    // create quiz
    async createQuiz(quizData) {
        return await this.client.quiz.create({
            data: quizData,
        });
    }

    // return all quiz for a user 
    // TODO : add pagination
    async getAllQuiz(userId) {
        return await this.client.quiz.findMany({
            where: { createdBy: userId },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getQuizCreator(quizId) {
        return await this.client.quiz.findUnique({
            where: { id: quizId },
            select: {
                id: true,
                createdBy: true,
            },
        });
    }

    async getQuizForLiveSession(quizId) {
        return await this.client.quiz.findUnique({
            where: { id: quizId },
            select: {
                id: true,
                createdBy: true,
            },
        });
    }

}

export default QuizRepository;