import { z } from 'zod';

const createUpdate = z.object({
  body: z.object({
    label: z.string({ required_error: 'Department is Required' }),
  }),
});

export const DepartmentValidation = {
  createUpdate,
};
