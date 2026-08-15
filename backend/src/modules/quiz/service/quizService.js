import { BadRequestError, NotFoundError } from "../../../../shared/errors/app-error.js";

class QuizService {
    constructor(quizRepository) {
        this.repository = quizRepository;
    }

    async createQuiz(data, createdBy) {
        
        if (!createdBy || !data) {
            throw new BadRequestError("Quiz data and creator are required");
        }
        const {title,description,category}=data;
        let quizData=data.quizData.questions;
        return await this.repository.createQuiz({
            title,
            description,
            category,
            quizData,
            createdBy,
        });
    }

    async getAllQuiz(userId) {
        if(!userId){
            throw new BadRequestError("User ID is required");
        }
        return await this.repository.getAllQuiz(userId);
    }

    async getQuizById(id) {
        if(!id){
            throw new BadRequestError("Quiz ID is required");
        }
        const quiz = await this.repository.getQuizById(id);

        if (!quiz) {
            throw new NotFoundError("Quiz not found");
        }

        return quiz;
    }
}

export default QuizService;