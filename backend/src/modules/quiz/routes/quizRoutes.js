import Router from "express";
import authenticate from "../../../../shared/middlewares/authmiddleware.js";
import QuizController from "../controller/quizController.js";
import QuizRepository from "../repository/quizRepository.js";
import QuizService from "../service/quizService.js";
import validate from "../../../../shared/middlewares/validate.js";
import { createQuizSchema } from "../validation/quizValidation.js";
const quizRouter = Router();

const quizRepository = new QuizRepository();
const quizService = new QuizService(quizRepository);
const quizController = new QuizController(quizService)

quizRouter.post("/", authenticate, validate(createQuizSchema,"body"), (req, res, next) => {
    quizController.createQuiz(req, res, next);
});

quizRouter.get("/", authenticate, (req, res, next) => {
    quizController.getAllQuiz(req, res, next);
});

quizRouter.get("/:id", authenticate, (req, res, next) => {
    quizController.getQuizById(req, res, next);
});

export default quizRouter;