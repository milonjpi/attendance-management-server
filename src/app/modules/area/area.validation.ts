import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Area is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Area is Required' }),
  }),
});

export const AreaValidation = {
  create,
  update,
};
