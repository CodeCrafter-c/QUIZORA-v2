import { BadRequestError, AppError, NotFoundError, ForbiddenError } from "../../../../shared/errors/app-error.js";

class LivequizService {
    constructor(liveQuizRepository, quizRepository) {
        this.liveQuizRepository = liveQuizRepository;
        this.quizRepository = quizRepository;
    }

    async createLiveQuizSession(quizId, startedBy) {

        // check quiz exists
        const quiz = await this.quizRepository.getQuizForLiveSession(quizId);

        if (!quiz) {
            throw new NotFoundError("Quiz not found");
        }
        // check started by and quiz creator are same
        if (quiz.createdBy !== startedBy) {
            throw new ForbiddenError(
                "You are not authorized to start this quiz"
            );
        }

        // reject if this quiz already has an active session
        const activeSession = await this.liveQuizRepository.findActiveSessionByQuizId(quizId);

        if (activeSession) {
            return activeSession;
        }

        // generate code
        const joinCode = await this.generateJoinCode();

        const session = await this.liveQuizRepository.createLiveQuizSession({
            quizId,
            startedBy,
            joinCode,
            status: "WAITING",
        });

        //  TODO: save session in redis

        return session;

    }

    async generateJoinCode() {
        // 1. Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000);

        // 2. Convert to string
        const joinCode = code.toString();

        // 3. Check if it already exists in DB
        const exists = await this.liveQuizRepository.findByJoinCode(joinCode);

        // 4. If yes → recursively generate again
        if (exists) {
            return this.generateJoinCode();
        }

        // 5. If no → return the code
        return joinCode;
    }

    async startSession({ sessionId, userId }) {
        const session = await this.liveQuizRepository.findSessionById(sessionId);

        if (!session) {
            throw new NotFoundError("Session not found");
        }

        if (session.startedBy !== userId) {
            throw new ForbiddenError(
                "You are not authorized to start this quiz"
            );
        }

        if (session.status !== "WAITING") {
            throw new BadRequestError("Session is already started");
        }


        const updatedSession = await this.liveQuizRepository.updateLiveQuizSession(sessionId, {
            status: "LIVE",
            startedAt: new Date(),
        });

        // TODO: save session in redis
        return updatedSession;
    }

    // only for participants
    async joinSession({ joinCode, joiningAs, userId }) {
        if (!joinCode || !joiningAs) {
            throw new BadRequestError("Invalid data");
        }

        if (joiningAs !== "Participant" && joiningAs !== "Spectator") {
            throw new BadRequestError(
                "You can only join as Participant or Spectator"
            );
        }

        const session = await this.liveQuizRepository.findByJoinCode(joinCode);
        if (!session) {
            throw new NotFoundError("Session not found");
        }

        if (session.status === "ENDED") {
            throw new BadRequestError("Session has already ended");
        }

        if (
            session.status === "LIVE" &&
            joiningAs === "Participant"
        ) {
            throw new BadRequestError(
                "You cannot join as a participant after the quiz has started"
            );
        }
        // host cannot join their own session
        if (session.startedBy === userId) {
            throw new ForbiddenError("Host cannot join their own session");
        }

        // check if already in session i redis

        // add  user to redis

        // return session state

        return {
            quizId: session.quizId,
            sessionId: session.id,
            joinedAs: joiningAs
        }

    }
}

export default LivequizService;