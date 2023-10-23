import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DesignationController } from './designation.controller';
import { DesignationValidation } from './designation.validation';

const router = express.Router();

// create designation
router.post(
  '/create',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(DesignationValidation.createUpdate),
  DesignationController.createDesignation
);

// get all designation
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DesignationController.getDesignations
);

// get single designation
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DesignationController.getSingleDesignation
);

// update single designation
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(DesignationValidation.createUpdate),
  DesignationController.updateDesignation
);

// delete single designation
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DesignationController.deleteDesignation
);

export const DesignationRoutes = router;
