import * as z from 'zod';

export const RegisterSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters"
  })
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords did not match",
  path: ["confirmPassword"]
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});