import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Shop Name is Required' }),
    address: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    address: z.string().optional().nullable(),
  }),
});

export const ShopValidation = {
  create,
  update,
};
