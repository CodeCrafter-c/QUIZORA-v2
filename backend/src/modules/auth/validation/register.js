import z from "zod";

export const registerSchema = z.object({
    firstName: z.string().trim().min(2, "Firstname must be at least 2 characters long"),

    lastName: z
        .string()
        .trim()
        .min(2, "Lastname must be at least 2 characters long")
        .optional(),

    email: z.email("Invalid email format").trim(),

    password: z
        .string().trim()
        .min(6, "Password must be at least 6 characters long"),
});

export default registerSchema;