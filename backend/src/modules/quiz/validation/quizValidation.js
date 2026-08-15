import z from "zod";

export const questionSchema = z.object({
    question: z
        .string()
        .min(1, "Question cannot be empty"),

    options: z
        .array(z.string().min(1, "Option cannot be empty"))
        .min(2, "A question must have at least 2 options"),

    correctAnswer: z
        .number()
        .int("Correct answer must be an integer")
        .nonnegative("Correct answer cannot be negative"),
});

export const createQuizSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long"),

    description: z
        .string()
        .min(3, "Description must be at least 3 characters long"),

    category: z
        .string()
        .min(3, "Category must be at least 3 characters long"),

    quizData: z.object({
        questions: z
            .array(questionSchema)
            .min(1, "Quiz must contain at least one question"),
    }),
});