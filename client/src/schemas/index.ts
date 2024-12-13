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

export const createActivitySchema = z.object({
  itineraryId: z.number(),
  activityName: z.string(),
  address: z.string(),
  locationName: z.string(),
  date: z.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
});