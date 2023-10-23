import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DepartmentValidation } from './department.validation';
import { DepartmentController } from './department.controller';

const router = express.Router();

// create department
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(DepartmentValidation.createUpdate),
  DepartmentController.createDepartment
);

// get all department
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DepartmentController.getDepartments
);

// get single department
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DepartmentController.getSingleDepartment
);

// update single department
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(DepartmentValidation.createUpdate),
  DepartmentController.updateDepartment
);

// delete single department
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DepartmentController.deleteDepartment
);

export const DepartmentRoutes = router;
