import { z } from 'zod';

const createUpdate = z.object({
  body: z.object({
    label: z.string({ required_error: 'Location is Required' }),
  }),
});

export const LocationValidation = {
  createUpdate,
};
