import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { DesignationRoutes } from '../modules/designation/designation.route';
import { DepartmentRoutes } from '../modules/department/department.route';
import { MenuPermissionRoutes } from '../modules/menuPermission/menuPermission.route';
import { SubMenuPermissionRoutes } from '../modules/subMenuPermission/subMenuPermission.route';
import { SectionPermissionRoutes } from '../modules/sectionPermission/sectionPermission.route';
import { LocationRoutes } from '../modules/location/location.route';
import { EmployeeRoutes } from '../modules/employee/employee.route';
import { AttendanceRoutes } from '../modules/attendance/attendance.route';
import { ReportRoutes } from '../modules/report/report.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/menu-permission',
    route: MenuPermissionRoutes,
  },
  {
    path: '/subMenu-permission',
    route: SubMenuPermissionRoutes,
  },
  {
    path: '/section-permission',
    route: SectionPermissionRoutes,
  },
  {
    path: '/designation',
    route: DesignationRoutes,
  },
  {
    path: '/department',
    route: DepartmentRoutes,
  },
  {
    path: '/location',
    route: LocationRoutes,
  },
  {
    path: '/employee',
    route: EmployeeRoutes,
  },
  {
    path: '/attendance',
    route: AttendanceRoutes,
  },
  {
    path: '/report',
    route: ReportRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
