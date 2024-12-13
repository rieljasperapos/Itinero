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
  username: z.string(),
  password: z.string().min(6),
});

export const createItinerarySchema = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export const EditInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const EditPasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[\W_]/, "Password must contain at least one special character."),
  reTypePassword: z.string().min(8, "Password must be at least 8 characters long."),
}).refine(data => data.newPassword === data.reTypePassword, {
  message: "Passwords don't match",
  path: ["reTypePassword"],
});