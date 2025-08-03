import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { employeeFilesUpload } from './employee.utils';
import { EmployeeValidation } from './employee.validation';
import { EmployeeController } from './employee.controller';

const router = express.Router();

// create Employee
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  employeeFilesUpload,
  validateRequest(EmployeeValidation.create),
  EmployeeController.createEmployee
);

// create user
router.post(
  '/user',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EmployeeController.createUser
);

// get all Employees
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EmployeeController.getAllEmployees
);

// get single active Employee
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EmployeeController.getSingleEmployee
);

// get single user Employee
router.get(
  '/:id/user',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EmployeeController.getSingleUserEmployee
);

// update Employee
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  employeeFilesUpload,
  validateRequest(EmployeeValidation.update),
  EmployeeController.updateEmployee
);

// update additional location
router.patch(
  '/:id/additional-location',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EmployeeController.updateAdditionalLocation
);

export const EmployeeRoutes = router;
