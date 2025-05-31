import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Branch is Required' }),
    areaId: z.number({ required_error: 'Area ID is Required' }),
    address: z.string({ required_error: 'Address is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    areaId: z.number().optional(),
    address: z.string().optional(),
  }),
});

export const LocationValidation = {
  create,
  update,
};
