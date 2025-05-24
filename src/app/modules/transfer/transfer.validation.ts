import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    date: z.string({ required_error: 'Date is required' }),
    fromLocationId: z.number({ required_error: 'Location(From) is Required' }),
    toLocationId: z.number({ required_error: 'Location(To) is Required' }),
    remarks: z.string().optional().nullable(),
    isApproved: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    date: z.string().optional(),
    fromLocationId: z.number().optional(),
    toLocationId: z.number().optional(),
    remarks: z.string().optional().nullable(),
    isApproved: z.boolean().optional(),
  }),
});

export const TransferValidation = {
  create,
  update,
};
