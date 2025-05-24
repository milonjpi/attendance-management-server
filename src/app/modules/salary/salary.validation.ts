import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    fromDate: z.string({ required_error: 'Date(From) is required' }),
    toDate: z.string().optional().nullable(),
    salary: z.number({ required_error: 'Salary is Required' }),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional().nullable(),
    salary: z.number().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const SalaryValidation = {
  create,
  update,
};
