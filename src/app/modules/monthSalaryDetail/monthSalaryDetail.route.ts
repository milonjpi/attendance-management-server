import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { MonthSalaryDetailController } from './monthSalaryDetail.controller';

const router = express.Router();

// get all
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthSalaryDetailController.getAll
);

// receive salary
router.patch(
  '/:id/receive',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthSalaryDetailController.receiveSalary
);

export const MonthSalaryDetailRoutes = router;
