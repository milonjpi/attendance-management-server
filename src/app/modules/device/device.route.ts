import express from 'express';
import { DeviceController } from './device.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DeviceValidation } from './device.validation';

const router = express.Router();

// create User Info
router.post(
  '/user/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DeviceValidation.create),
  DeviceController.createDeviceEmployee
);

// get all User Info
router.get(
  '/user',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DeviceController.getDeviceEmployee
);

// get single User Info
router.get(
  '/user/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DeviceController.getDeviceEmployeeById
);

// update User Info
router.patch(
  '/user/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DeviceValidation.update),
  DeviceController.updateDeviceEmployee
);

// delete User Info
router.delete(
  '/user/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DeviceController.deleteDeviceEmployee
);

// terminal work
// get all terminals
router.get(
  '/terminal',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DeviceController.getAllTerminals
);

// get terminal by user id
router.get(
  '/terminal/:id',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DeviceController.getAllTerminalsById
);

// assign terminal to user
router.post(
  '/terminal/user',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DeviceValidation.assignTerminalToUser),
  DeviceController.assignTerminalToUser
);

// remove terminal from user
router.patch(
  '/terminal/:id/remove',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DeviceValidation.removeUserTerminal),
  DeviceController.removeUserFromTerminal
);

export const DeviceRoutes = router;
