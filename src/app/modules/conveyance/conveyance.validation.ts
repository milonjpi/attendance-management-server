import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    date: z.string({ required_error: 'Date is required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    remarks: z.string().optional().nullable(),
    conveyanceDetails: z
      .object({
        itemTypeId: z.number({ required_error: 'Type ID is Required' }),
        from: z.string().optional().nullable(),
        to: z.string().optional().nullable(),
        distance: z.number().optional(),
        vehicleTypeId: z.number().optional(),
        details: z.string().optional().nullable(),
        amount: z.number({ required_error: 'Amount is Required' }),
        remarks: z.string().optional().nullable(),
      })
      .array(),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    date: z.string().optional(),
    amount: z.number().optional(),
    remarks: z.string().optional().nullable(),
    conveyanceDetails: z
      .object({
        itemTypeId: z.number({ required_error: 'Type ID is Required' }),
        from: z.string().optional().nullable(),
        to: z.string().optional().nullable(),
        distance: z.number().optional(),
        vehicleTypeId: z.number().optional(),
        details: z.string().optional().nullable(),
        amount: z.number({ required_error: 'Amount is Required' }),
        remarks: z.string().optional().nullable(),
      })
      .array(),
  }),
});

export const ConveyanceValidation = {
  create,
  update,
};
