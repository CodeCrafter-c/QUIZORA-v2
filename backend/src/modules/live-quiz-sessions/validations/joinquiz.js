import z from "zod";

const createLiveQuizSessionSchema = z.object({
    quizId: z.string().min(1, "Quiz ID is required"),
});

const startSessionSchema = z.object({
    sessionId: z.string().min(1, "Session ID is required"),
});

const joinSessionSchema = z.object({
    joinCode: z.string().min(1, "Join Code is required"),
    joiningAs: z.enum(["Spectator", "Participant"]),
});

export {
    createLiveQuizSessionSchema,
    startSessionSchema,
    joinSessionSchema,
};