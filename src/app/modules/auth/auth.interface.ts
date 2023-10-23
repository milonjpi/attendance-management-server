import { User } from '@prisma/client';

export type ILoginUserResponse = {
  accessToken: string;
  user: User;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
  user: User;
};
