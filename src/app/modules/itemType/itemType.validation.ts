import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Type is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Type is Required' }),
  }),
});

export const ItemTypeValidation = {
  create,
  update,
};
