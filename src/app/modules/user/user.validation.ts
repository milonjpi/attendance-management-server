import { z } from 'zod';
import { userRoles } from './user.constant';

const update = z.object({
  body: z.object({
    fullName: z.string().optional(),
    userName: z.string().optional(),
    password: z.string().optional(),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
    profileImg: z.string().optional().nullable(),
  }),
});

export const UserValidation = {
  update,
};
