import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    date: z.string({ required_error: 'Date is Required' }),
    inTime: z.string({ required_error: 'In Time is Required' }),
    outTime: z.string().optional().nullable(),
    deviceId: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    realPunch: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    date: z.string().optional(),
    inTime: z.string().optional(),
    outTime: z.string().optional().nullable(),
    deviceId: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    realPunch: z.boolean().optional(),
  }),
});

export const AttendanceValidation = {
  create,
  update,
};
