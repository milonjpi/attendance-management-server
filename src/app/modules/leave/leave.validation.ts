import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    fromDate: z.string({ required_error: 'From Date is Required' }),
    toDate: z.string({ required_error: 'To Date is Required' }),
    days: z.number({ required_error: 'Days is Required' }),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    days: z.number().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const LeaveValidation = {
  create,
  update,
};
