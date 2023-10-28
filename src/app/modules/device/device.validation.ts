import { z } from 'zod';

const create = z.object({
  body: z.object({
    ID: z.string({ required_error: 'Employee ID is Required' }),
    Name: z.string({ required_error: 'Name is Required' }),
    RFID: z.string({ required_error: 'RFID is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    RFID: z.string({ required_error: 'RFID is Required' }),
  }),
});
const assignTerminalToUser = z.object({
  body: z.object({
    UserIDIndex: z.string({ required_error: 'User ID Index is Required' }),
    TerminalID: z.number({ required_error: 'Terminal ID is Required' }),
    UserID: z.string({ required_error: 'User ID is Required' }),
  }),
});

const removeUserTerminal = z.object({
  body: z.object({
    TerminalID: z.number({ required_error: 'Terminal ID is Required' }),
  }),
});

export const DeviceValidation = {
  create,
  update,
  assignTerminalToUser,
  removeUserTerminal,
};
