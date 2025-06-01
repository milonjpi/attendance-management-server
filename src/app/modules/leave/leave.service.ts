import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Leave, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { ILeaveFilters } from './leave.interface';
import { leaveSearchableFields } from './leave.constant';

// create Leave
const createLeave = async (data: Leave): Promise<Leave | null> => {
  const result = await prisma.leave.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Leave');
  }

  return result;
};

// get all Leaves
const getAllLeaves = async (
  filters: ILeaveFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Leave[]>> => {
  const { searchTerm, startDate, endDate, locationId, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: leaveSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  if (startDate) {
    andConditions.push({
      fromDate: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }

  if (endDate) {
    andConditions.push({
      fromDate: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (locationId) {
    andConditions.push({
      employee: { locationId: Number(locationId) },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.LeaveWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.leave.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      employee: {
        include: {
          designation: true,
          department: true,
          location: {
            include: {
              area: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.leave.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// get single Leave
const getSingleLeave = async (id: number): Promise<Leave | null> => {
  const result = await prisma.leave.findFirst({
    where: {
      id,
    },
    include: {
      employee: {
        include: {
          designation: true,
          department: true,
          location: {
            include: {
              area: true,
            },
          },
        },
      },
    },
  });

  return result;
};

// update Leave
const updateLeave = async (
  id: number,
  data: Partial<Leave>,
  role: string
): Promise<Leave | null> => {
  // check is exist
  const isExist = await prisma.leave.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leave Not Found');
  }

  if (isExist.status === 'Approved' && role === 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  if (isExist.status === 'Rejected' && role === 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Rejected');
  }

  const result = await prisma.leave.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete leave
const deleteLeave = async (id: number, role: string): Promise<Leave | null> => {
  // check is exist
  const isExist = await prisma.leave.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leave Not Found');
  }

  if (isExist.status === 'Approved' && role === 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  if (isExist.status === 'Rejected' && role === 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Rejected');
  }

  const result = await prisma.leave.delete({
    where: {
      id,
    },
  });

  return result;
};

export const LeaveService = {
  createLeave,
  getAllLeaves,
  getSingleLeave,
  updateLeave,
  deleteLeave,
};
