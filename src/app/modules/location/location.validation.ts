import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Location is Required' }),
    areaId: z.string({ required_error: 'Area ID is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    areaId: z.string().optional(),
  }),
});

export const LocationValidation = {
  create,
  update,
};
