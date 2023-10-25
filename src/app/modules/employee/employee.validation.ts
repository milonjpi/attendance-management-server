import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is Required' }),
    officeId: z.string().optional(),
    designationId: z.number({ required_error: 'Designation is Required' }),
    departmentId: z.number({ required_error: 'Department is Required' }),
    locationId: z.number({ required_error: 'Location is Required' }),
    contactNo: z.string().optional(),
    address: z.string().optional(),
    photo: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    officeId: z.string().optional(),
    designationId: z.number().optional(),
    departmentId: z.number().optional(),
    locationId: z.number().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
    photo: z.string().optional(),
  }),
});

export const EmployeeValidation = {
  create,
  update,
};
