import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    name: z.string({ required_error: 'Name is Required' }),
    designation: z.string({ required_error: 'Designation is Required' }),
    department: z.string({ required_error: 'Department is Required' }),
    nid: z.string().optional(),
    brand: z.string({ required_error: 'Brand is Required' }),
    model: z.string({ required_error: 'Model is Required' }),
    cc: z.string({ required_error: 'Engine CC is Required' }),
    regNo: z.string().optional(),
    bikerPhoto: z.string({ required_error: 'Biker Photo is Required' }),
    bikePaper: z.string({ required_error: 'Bike Paper is Required' }),
    bikePhoto: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    name: z.string().optional(),
    designation: z.string().optional(),
    department: z.string().optional(),
    nid: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    cc: z.string().optional(),
    regNo: z.string().optional(),
    bikerPhoto: z.string().optional(),
    bikePaper: z.string().optional(),
    bikePhoto: z.string().optional(),
  }),
});

export const BikerValidation = {
  create,
  update,
};
