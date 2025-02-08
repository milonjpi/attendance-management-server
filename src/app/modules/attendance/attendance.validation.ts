import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    date: z.string({ required_error: 'Date is Required' }),
    inTime: z.string({ required_error: 'In Time is Required' }),
    outTime: z.string().optional(),
  }),
});

export const AttendanceValidation = {
  create,
};
