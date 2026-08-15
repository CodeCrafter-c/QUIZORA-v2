import { Router } from "express";
import authenticate from "../../../../shared/middlewares/authmiddleware.js";
import LiveQuizController from "../controller/liveQuizController.js";
import LiveQuizRepository from "../repository/LiveQuizRepository.js";
import LiveQuizService from "../services/liveQuizService.js";
import QuizRepository from "../../quiz/repository/QuizRepository.js";
import validate from "../../../../shared/middlewares/validate.js";
import { createLiveQuizSessionSchema,joinSessionSchema,startSessionSchema } from "../validations/joinquiz.js";

;
const liveQuizRepository = new LiveQuizRepository();
const quizRepository = new QuizRepository();

const liveQuizService = new LiveQuizService(
    liveQuizRepository,
    quizRepository
);

const liveQuizController = new LiveQuizController(liveQuizService);

const liveQuizRouter = Router();

liveQuizRouter.post(
    "/:quizId",
    authenticate,
    validate(createLiveQuizSessionSchema, "params"),
    (req, res, next) => {
        liveQuizController.createLiveQuizSession(req, res, next);
    }
);

liveQuizRouter.post(
    "/start/:sessionId",
    authenticate,
    validate(startSessionSchema,"params"),
    (req, res, next) => {
        liveQuizController.startSession(req, res, next);
    }
);

liveQuizRouter.post(
    "/join",
    authenticate,
    validate(joinSessionSchema,"body"),
    (req, res, next) => {
        liveQuizController.joinSession(req, res, next);
    }
);

export default liveQuizRouter;