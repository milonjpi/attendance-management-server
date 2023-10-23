import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

// user signup
router.post(
  '/signup',
  validateRequest(AuthValidation.signUp),
  AuthController.signUp
);

// user signUp
router.post(
  '/signin',
  validateRequest(AuthValidation.signIn),
  AuthController.signIn
);

// logout
router.get(
  '/logout',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.logout
);

// refresh token
router.get(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
