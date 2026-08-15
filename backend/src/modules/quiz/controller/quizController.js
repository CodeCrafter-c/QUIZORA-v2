class QuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }

    async createQuiz(req, res, next) {
        try {
            const data  = req.body;
            const createdBy = req.user.userId;
            const quiz = await this.quizService.createQuiz(data, createdBy);
            return res.status(201).json({
                success: true,
                message: "Quiz created successfully",
                data: quiz,
            });
        }
        catch (error) {
            next(error);
        }
    }

    async getAllQuiz(req, res, next) {
        try {
            const userId = req.user.userId;
            const quizzes = await this.quizService.getAllQuiz(userId);
            return res.status(200).json({
                success: true,
                message: "Quizzes fetched successfully",
                data: quizzes,
            });
        }
        catch (error) {
            next(error);
        }
    }

    async getQuizById(req, res, next) {
        try {
            const { id } = req.params;
            const quiz = await this.quizService.getQuizById(id);
            return res.status(200).json({
                success: true,
                message: "Quiz fetched successfully",
                data: quiz,
            });
        }
        catch (error) {
            next(error);
        }
    }
}

export default QuizController;