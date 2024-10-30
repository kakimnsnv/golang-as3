import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.boolean().default(false),
});
export const SignUpSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Minimum 6 characteers required" }),
  role: z.boolean().default(false),
});
