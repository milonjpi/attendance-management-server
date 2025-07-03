import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Branch is Required' }),
    areaId: z.number({ required_error: 'Area ID is Required' }),
    address: z.string({ required_error: 'Address is Required' }),
    lat: z.string().optional().nullable(),
    lon: z.string().optional().nullable(),
    weekend: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    areaId: z.number().optional(),
    address: z.string().optional(),
    lat: z.string().optional().nullable(),
    lon: z.string().optional().nullable(),
    weekend: z.string().optional(),
  }),
});

export const LocationValidation = {
  create,
  update,
};
