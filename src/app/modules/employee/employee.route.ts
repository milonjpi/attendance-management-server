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
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  employeeFilesUpload,
  validateRequest(EmployeeValidation.create),
  EmployeeController.createEmployee
);

// get all Employees
router.get(
  '/',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EmployeeController.getAllEmployees
);

// get single Employee
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EmployeeController.getSingleEmployee
);

// update Employee
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  employeeFilesUpload,
  validateRequest(EmployeeValidation.update),
  EmployeeController.updateEmployee
);

// inactive Employee
router.patch(
  '/:id/inactive',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  EmployeeController.inActiveEmployee
);

export const EmployeeRoutes = router;
