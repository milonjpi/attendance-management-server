import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    date: z.string({ required_error: 'Date is required' }),
    from: z.string({ required_error: 'From Location is Required' }),
    to: z.string({ required_error: 'To Location Required' }),
    distance: z.number({ required_error: 'Distance is Required' }),
    vehicleTypeId: z.number({ required_error: 'Vehicle Type ID is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    extraAmount: z.number().optional().default(0),
    remarks: z.string().optional().nullable(),
    conveyanceDetails: z
      .object({
        itemTypeId: z.number({ required_error: 'Type ID is Required' }),
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
    from: z.string().optional(),
    to: z.string().optional(),
    distance: z.number().optional(),
    vehicleTypeId: z.number().optional(),
    amount: z.number().optional(),
    extraAmount: z.number().optional(),
    remarks: z.string().optional().nullable(),
    conveyanceDetails: z
      .object({
        itemTypeId: z.number().optional(),
        details: z.string().optional().nullable(),
        amount: z.number().optional(),
        remarks: z.string().optional().nullable(),
      })
      .array(),
  }),
});

export const ConveyanceValidation = {
  create,
  update,
};
