import { z } from "zod";

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "CONVERTED",
  "LOST",
] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Name kam se kam 2 akshar ka ho"),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{10,15}$/, "Valid mobile number daalo (10-15 digits)"),
  email: z.string().trim().email("Valid email daalo"),
  company: z.string().trim().optional().or(z.literal("")),
  source: z.string().trim().min(1, "Lead source daalo"),
  status: z.enum(LEAD_STATUSES),
  notes: z.string().trim().optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;