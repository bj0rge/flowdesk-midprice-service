import z from "zod";

const validationErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  detail: z.unknown(),
});

export const defaultErrorsSchema = {
  400: validationErrorSchema,
  500: validationErrorSchema,
};
