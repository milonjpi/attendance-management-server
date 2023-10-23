import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { User } from '@prisma/client';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';

// signup
const signUp = async (data: User): Promise<User | null> => {
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await prisma.user.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Signup');
  }

  return result;
};

// signIn
const signIn = async (
  payload: Pick<User, 'userName' | 'password'>
): Promise<ILoginUserResponse> => {
  const { userName, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      userName,
    },
    include: {
      menus: true,
      subMenus: true,
      sections: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
  // create access token and refresh token
  const { role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userName, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userName, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    user: isUserExist,
    refreshToken,
  };
};

// refresh token
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userName } = verifiedToken;

  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findUnique({
    where: {
      userName,
    },
    include: {
      menus: true,
      subMenus: true,
      sections: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      userName: isUserExist.userName,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
    user: isUserExist,
  };
};

export const AuthService = {
  signUp,
  signIn,
  refreshToken,
};
