import express from 'express';
import { bikerFilesUpload } from './biker.utils';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BikerValidation } from './biker.validation';
import { BikerController } from './biker.controller';

const router = express.Router();

// create biker
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  bikerFilesUpload,
  validateRequest(BikerValidation.create),
  BikerController.createBiker
);

// get all bikers
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BikerController.getAllBikers
);

// get single biker
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BikerController.getSingleBiker
);

// inactive biker
router.patch(
  '/:id/inactive',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BikerController.inActiveBiker
);

export const BikerRoutes = router;
