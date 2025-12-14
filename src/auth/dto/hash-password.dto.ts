import { z } from 'zod/v4';

const HashPasswordSchema = z.object({
  password: z.string(),
});

type HashPasswordDto = z.infer<typeof HashPasswordSchema>;

export { type HashPasswordDto, HashPasswordSchema };
