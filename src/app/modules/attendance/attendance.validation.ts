import { z } from 'zod';

const create = z.object({
  body: z.object({
    employeeId: z.string({ required_error: 'Employee is Required' }),
    inTime: z.string({ required_error: 'In Time is Required' }),
    outTime: z.string().optional(),
  }),
});

export const AttendanceValidation = {
  create,
};
