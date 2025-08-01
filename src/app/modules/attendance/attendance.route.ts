import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { AttendanceValidation } from './attendance.validation';
import { AttendanceController } from './attendance.controller';

const router = express.Router();

// create Attendance
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(AttendanceValidation.create),
  AttendanceController.createAttendance
);

// create geo Attendance
router.post(
  '/geo-attendance',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(AttendanceValidation.create),
  AttendanceController.createGeoAttendance
);

// create geo leave
router.post(
  '/geo-leave',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(AttendanceValidation.update),
  AttendanceController.createGeoLeave
);

// get all Attendances
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  AttendanceController.getAllAttendances
);

// get single Attendances
router.get(
  '/single',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  AttendanceController.getSingleAttendances
);

// delete Attendance
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  AttendanceController.deleteAttendance
);

export const AttendanceRoutes = router;
