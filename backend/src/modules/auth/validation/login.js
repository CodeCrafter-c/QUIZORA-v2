import z from "zod";

export const credentialLoginSchema = z.object({
    email: z.email("Invalid email format").trim(),
    password: z.string().trim().min(6, "Password must be at least 6 characters long"),
    type:z.literal("credentials").default("credentials"),
})
export const googleLoginSchema = z.object({
    code: z.string().min(1, "Code is required").trim(),
})