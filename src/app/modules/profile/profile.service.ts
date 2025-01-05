import prisma from '../../../shared/prisma';
import { User } from '@prisma/client';

// get profile
const getProfile = async (id: number): Promise<User | null> => {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      menus: true,
      subMenus: true,
      sections: true,
    },
  });

  return result;
};

export const ProfileService = {
  getProfile,
};
