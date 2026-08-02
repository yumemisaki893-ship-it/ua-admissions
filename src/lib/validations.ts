import { z } from "zod";

const phoneRegex = /^(09\d{9}|\+63\d{10}|\d{7,11})$/;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const registerSchema = z
  .object({
    name: z.string().min(2, "Please enter your full name.").max(100),
    email: z.string().email("Please enter a valid email address.").max(190),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/\d/, "Password must contain a number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

// ---------------------------------------------------------------------------
// Student profile / application
// ---------------------------------------------------------------------------
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required.").max(100),
  middleName: z.string().max(100).optional().or(z.literal("")),
  lastName: z.string().min(2, "Last name is required.").max(100),
  suffix: z.string().max(10).optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"], { message: "Please select a gender." }),
  birthDate: z.string().min(1, "Birth date is required."),
  birthplace: z.string().max(190).optional().or(z.literal("")),
  address: z.string().min(5, "Complete address is required.").max(300),
  city: z.string().min(2, "City / Municipality is required.").max(100),
  province: z.string().min(2, "Province is required.").max(100),
  zipCode: z.string().max(10).optional().or(z.literal("")),
  contactNumber: z.string().regex(phoneRegex, "Enter a valid Philippine mobile number."),
  guardianName: z.string().min(2, "Guardian's name is required.").max(150),
  guardianContact: z.string().max(20).optional().or(z.literal("")),
});

export const courseSelectionSchema = z.object({
  courseId: z.string().min(1, "Please select a course."),
});

export const documentTypeSchema = z.enum(["BIRTH_CERT", "FORM_137", "PHOTO"]);

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------
export const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg"] as const;
export const maxUploadSizeBytes = 5 * 1024 * 1024; // 5 MB

export const uploadSchema = z.object({
  fileName: z.string().min(1).max(190),
  mimeType: z.enum(allowedMimeTypes, { message: "Only PDF, PNG, and JPEG files are allowed." }),
  sizeBytes: z.number().int().positive().max(maxUploadSizeBytes, "File must be 5MB or smaller."),
});

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required.").max(120),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(3, "Subject is required.").max(150),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000),
});

// ---------------------------------------------------------------------------
// Admin - content management
// ---------------------------------------------------------------------------
export const newsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(200),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  category: z.enum(["NEWS", "EVENT", "ANNOUNCEMENT"]),
  published: z.boolean(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  content: z.any(),
});

export const courseSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(5).max(200),
  description: z.string().min(10),
  durationYears: z.coerce.number().int().min(1).max(8),
  careerOpportunities: z.array(z.string().min(1)).optional(),
  collegeId: z.string().min(1),
});

export const collegeSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(5).max(200),
  description: z.string().min(5).max(500),
});

export const applicationStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED"]),
  remarks: z.string().max(1000).optional().or(z.literal("")),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
