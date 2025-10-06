import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ReportController } from './report.controller';

const router = express.Router();

// get Employees Report
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.getEmployeesReport
);
router.get(
  '/salary',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.getSalaryReport
);
// expense summary
router.get(
  '/expense-summary',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.expenseSummary
);
// employee conveyance
router.get(
  '/employee-conveyance',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.employeeConveyanceSummary
);
// expense summary year
router.get(
  '/expense-summary-year',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.expenseSummaryByYear
);
// expense summary month
router.get(
  '/expense-summary-month',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.expenseSummaryByMonth
);

export const ReportRoutes = router;
