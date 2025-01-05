import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is Required' }),
    officeId: z.string({ required_error: 'Office ID is Required' }),
    joiningDate: z.string().optional().nullable(),
    resignDate: z.string().optional().nullable(),
    designationId: z.number({ required_error: 'Designation is Required' }),
    departmentId: z.number({ required_error: 'Department is Required' }),
    locationId: z.number({ required_error: 'Location is Required' }),
    contactNo: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    photo: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    officeId: z.string().optional(),
    joiningDate: z.string().optional().nullable(),
    resignDate: z.string().optional().nullable(),
    designationId: z.number().optional(),
    departmentId: z.number().optional(),
    locationId: z.number().optional(),
    contactNo: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    photo: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const EmployeeValidation = {
  create,
  update,
};
