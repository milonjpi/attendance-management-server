import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'UOM is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'UOM is Required' }),
  }),
});

export const UomValidation = {
  create,
  update,
};
