import { z } from 'zod'

export const mutationSuccessSchema = z.object({
  success: z.literal(true),
})

export const scanIdResponseSchema = z.object({
  scan_id: z.string().min(1),
})
