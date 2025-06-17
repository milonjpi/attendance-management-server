import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Item is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Item is Required' }),
  }),
});

export const ItemValidation = {
  create,
  update,
};
