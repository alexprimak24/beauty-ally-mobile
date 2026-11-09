import { z } from 'zod'

const highlightedFactorSchema = z.object({
  title: z.string(),
  score: z.number(),
})

const frequencySchema = z.object({
  times: z.string(),
  period: z.string(),
})

const routineConfigItemSchema = z.object({
  routine_entry_id: z.string(),
  frequency_type: z.enum(['daily', 'selected_weekdays']),
  weekdays_mask: z.number().int().nullable().optional(),
})

const routineConfigSchema = z.object({
  morning: routineConfigItemSchema.nullable().optional(),
  evening: routineConfigItemSchema.nullable().optional(),
})

export const productChecksEntrySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  productName: z.string(),
  ingredients: z.string(),
  frontImage: z.string(),
  backImage: z.string(),
  matchSummary: z.string(),
  ingredientMatchRating: z.number(),
  highlightedFactors: z.array(highlightedFactorSchema),
  routineCompatibility: z.number(),
  breakoutRisk: z.number(),
  bestTime: z.string(),
  frequency: frequencySchema,
  personalNote: z.string(),
  tips: z.string(),
  isFavorites: z.boolean(),
  inSkincare: z.boolean(),
  scanVersion: z.string().nullable(),
  purchaseLink: z.string().nullable(),
  routine_config: routineConfigSchema.nullable().optional(),
})

export type RoutineConfig = z.infer<typeof routineConfigSchema>
export type ProductChecksEntry = z.infer<typeof productChecksEntrySchema>
