import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    locationId: z.number().optional().nullable(),
    date: z.string({ required_error: 'Date is required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    remarks: z.string().optional().nullable(),
    isService: z.boolean().optional(),
    billDetails: z
      .object({
        itemId: z.number({ required_error: 'Item ID is Required' }),
        shopId: z.number().optional().nullable(),
        details: z.string().optional().nullable(),
        uomId: z.number().nullable(),
        quantity: z.number().default(0),
        amount: z.number({ required_error: 'Amount is Required' }),
        remarks: z.string().optional().nullable(),
      })
      .array(),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    locationId: z.number().optional().nullable(),
    date: z.string().optional(),
    amount: z.number().optional(),
    remarks: z.string().optional().nullable(),
    isService: z.boolean().optional(),
    billDetails: z
      .object({
        itemId: z.number({ required_error: 'Item ID is Required' }),
        shopId: z.number().optional().nullable(),
        details: z.string().optional().nullable(),
        uomId: z.number().nullable(),
        quantity: z.number().default(0),
        amount: z.number({ required_error: 'Amount is Required' }),
        remarks: z.string().optional().nullable(),
      })
      .array(),
  }),
});

export const BillValidation = {
  create,
  update,
};
