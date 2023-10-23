import { z } from 'zod';

const createUpdate = z.object({
  body: z.object({
    label: z.string({ required_error: 'Designation is Required' }),
  }),
});

export const DesignationValidation = {
  createUpdate,
};
