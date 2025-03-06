import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { LeaveValidation } from './leave.validation';
import { LeaveController } from './leave.controller';

const router = express.Router();

// create Leave
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(LeaveValidation.create),
  LeaveController.createLeave
);

// get all Leaves
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  LeaveController.getAllLeaves
);

// get single active Leave
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  LeaveController.getSingleLeave
);

// update Leave
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(LeaveValidation.update),
  LeaveController.updateLeave
);

export const LeaveRoutes = router;
