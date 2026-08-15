class LiveQuizController {
    constructor(liveQuizService) {
        this.liveQuizService = liveQuizService;
    }

    async createLiveQuizSession(req, res, next) {
        try {
            const { quizId } = req.params;
            const startedBy = req.user.userId;
            const session = await this.liveQuizService.createLiveQuizSession(quizId, startedBy);
            return res.status(201).json({
                success: true,
                message: "Live quiz session created successfully",
                data: session,
            });
        } catch (error) {
            next(error);
        }
    }
    async startSession(req, res, next) {
        try {
            const { sessionId } = req.params;
            const userId = req.user.userId;

            const session = await this.liveQuizService.startSession({
                sessionId,
                userId,
            });

            return res.status(200).json({
                success: true,
                message: "Live quiz session started successfully",
                data: session,
            });
        } catch (error) {
            next(error);
        }
    }

    async joinSession(req, res, next) {
        try {
            const { joinCode, joiningAs } = req.body;
            const userId = req.user.userId;

            const session = await this.liveQuizService.joinSession({
                joinCode,
                joiningAs,
                userId,
            });

            return res.status(200).json({
                success: true,
                message: "Joined session successfully",
                data: session,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default LiveQuizController;