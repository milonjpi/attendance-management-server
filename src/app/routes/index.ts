import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { DesignationRoutes } from '../modules/designation/designation.route';
import { DepartmentRoutes } from '../modules/department/department.route';
import { BrandRoutes } from '../modules/brand/brand.route';
import { BikeModelRoutes } from '../modules/bikeModel/bikeModel.route';
import { EngineCCRoutes } from '../modules/engineCC/engineCC.route';
import { BikerRoutes } from '../modules/biker/biker.route';
import { GuardRoutes } from '../modules/guard/guard.route';
import { StandLogRoutes } from '../modules/standLog/standLog.route';
import { MenuPermissionRoutes } from '../modules/menuPermission/menuPermission.route';
import { SubMenuPermissionRoutes } from '../modules/subMenuPermission/subMenuPermission.route';
import { SectionPermissionRoutes } from '../modules/sectionPermission/sectionPermission.route';
import { AuthLogRoutes } from '../modules/authLog/authLog.route';
import { GuestCardRoutes } from '../modules/guestCard/guestCard.route';
import { GuestRoutes } from '../modules/guest/guest.route';

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
    path: '/brand',
    route: BrandRoutes,
  },
  {
    path: '/model',
    route: BikeModelRoutes,
  },
  {
    path: '/engineCC',
    route: EngineCCRoutes,
  },
  {
    path: '/biker',
    route: BikerRoutes,
  },
  {
    path: '/guard',
    route: GuardRoutes,
  },
  {
    path: '/authLog',
    route: AuthLogRoutes,
  },
  {
    path: '/standLog',
    route: StandLogRoutes,
  },
  {
    path: '/guest-card',
    route: GuestCardRoutes,
  },
  {
    path: '/guest',
    route: GuestRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
