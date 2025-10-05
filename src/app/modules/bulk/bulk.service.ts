import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

// bulk create
const bulkCreate = async (): Promise<string> => {
  const result = await prisma.area.createMany();

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create');
  }

  return 'success';
};

export const BulkService = {
  bulkCreate,
};
