import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(255, "Email too long")
  .email("Enter a valid email");

export const phoneSchema = z
  .string()
  .trim()
  .min(10, "Phone must be at least 10 digits")
  .max(20, "Phone too long")
  .regex(/^[+\d\s()-]+$/, "Only digits, spaces, +, (), -")
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Phone must have 10+ digits");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long");

export const searchNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be 2+ characters")
  .max(50, "Name must be 50 characters or less")
  .regex(/^[^\u0000-\u001F]+$/, "Invalid characters");

export const budgetRangeSchema = z
  .tuple([z.number().int().min(0).max(50000), z.number().int().min(0).max(50000)])
  .refine(([min, max]) => min <= max, "Min cannot exceed max");

export const moveInSchema = z
  .object({
    mode: z.enum(["specific", "flexible"]),
    date: z.string().optional(),
  })
  .refine(
    (m) => m.mode === "flexible" || (typeof m.date === "string" && m.date.length > 0),
    { message: "Please pick a move-in date", path: ["date"] },
  );

export const commuteSchema = z
  .object({ maxMinutes: z.number().int().min(5).max(120).nullable() });
