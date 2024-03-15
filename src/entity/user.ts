import { createId } from '../util/id.js';
import { z } from 'zod';
import { randomInt } from 'crypto';

export const userSchema = z.object({
  id: z.string().default(() => createId()),
  username: z.string().nonempty(),
  discriminator: z.number().min(4).default(randomInt(1000, 9000)),
  password: z.string().nonempty(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type IUser = z.infer<typeof userSchema>;
