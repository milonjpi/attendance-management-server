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
import { ProfileRoutes } from '../modules/profile/profile.route';
import { DeviceRoutes } from '../modules/device/device.route';
import { LeaveRoutes } from '../modules/leave/leave.route';
import { AreaRoutes } from '../modules/area/area.route';
import { SalaryRoutes } from '../modules/salary/salary.route';
import { TransferRoutes } from '../modules/transfer/transfer.route';
import { ItemTypeRoutes } from '../modules/itemType/itemType.route';
import { VehicleTypeRoutes } from '../modules/vehicleType/vehicleType.route';
import { ConveyanceRoutes } from '../modules/conveyance/conveyance.route';
import { ItemRoutes } from '../modules/item/item.route';
import { ShopRoutes } from '../modules/shop/shop.route';
import { UomRoutes } from '../modules/uom/uom.route';
import { BillRoutes } from '../modules/bill/bill.route';
import { MonthSalaryRoutes } from '../modules/monthSalary/monthSalary.route';
import { MonthSalaryDetailRoutes } from '../modules/monthSalaryDetail/monthSalaryDetail.route';

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
    path: '/profile',
    route: ProfileRoutes,
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
    path: '/area',
    route: AreaRoutes,
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
    path: '/leave',
    route: LeaveRoutes,
  },
  {
    path: '/salary',
    route: SalaryRoutes,
  },
  {
    path: '/transfer',
    route: TransferRoutes,
  },
  {
    path: '/device',
    route: DeviceRoutes,
  },
  {
    path: '/report',
    route: ReportRoutes,
  },
  {
    path: '/item-type',
    route: ItemTypeRoutes,
  },
  {
    path: '/vehicle-type',
    route: VehicleTypeRoutes,
  },
  {
    path: '/conveyance',
    route: ConveyanceRoutes,
  },
  {
    path: '/item',
    route: ItemRoutes,
  },
  {
    path: '/shop',
    route: ShopRoutes,
  },
  {
    path: '/uom',
    route: UomRoutes,
  },
  {
    path: '/bill',
    route: BillRoutes,
  },
  {
    path: '/month-salary',
    route: MonthSalaryRoutes,
  },
  {
    path: '/month-salary-detail',
    route: MonthSalaryDetailRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
