import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Conveyance, ConveyanceDetail, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  IConveyanceFilters,
  IConveyanceResponse,
} from './conveyance.interface';
import { conveyanceSearchableFields } from './conveyance.constant';

// create
const insertIntoDB = async (
  data: Conveyance,
  conveyanceDetails: ConveyanceDetail[]
): Promise<Conveyance | null> => {
  const result = await prisma.conveyance.create({
    data: { ...data, conveyanceDetails: { create: conveyanceDetails } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add');
  }

  return result;
};

// get all
const getAll = async (
  filters: IConveyanceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IConveyanceResponse>> => {
  const { searchTerm, officeId, startDate, endDate, status } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: conveyanceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }
  if (officeId) {
    andConditions.push({
      officeId,
    });
  }

  if (startDate) {
    andConditions.push({
      date: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      date: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  const whereConditions: Prisma.ConveyanceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.conveyance.findMany({
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
      vehicleType: true,
      conveyanceDetails: {
        include: {
          itemType: true,
        },
      },
    },
  });

  const total = await prisma.conveyance.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalCount = await prisma.conveyance.aggregate({
    where: whereConditions,
    _sum: {
      amount: true,
      extraAmount: true,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: {
      data: result,
      sum: totalCount,
    },
  };
};

// get single
const getSingle = async (id: number): Promise<Conveyance | null> => {
  const result = await prisma.conveyance.findFirst({
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
      vehicleType: true,
      conveyanceDetails: {
        include: {
          itemType: true,
        },
      },
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<Conveyance>,
  conveyanceDetails: ConveyanceDetail[]
): Promise<Conveyance | null> => {
  // check is exist
  const isExist = await prisma.conveyance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conveyance Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.conveyance.update({
      where: { id },
      data: { conveyanceDetails: { deleteMany: {} } },
    });

    return await trans.conveyance.update({
      where: { id },
      data: { ...data, conveyanceDetails: { create: conveyanceDetails } },
    });
  });

  return result;
};

// approve
const approveSingle = async (id: number): Promise<Conveyance | null> => {
  // check is exist
  const isExist = await prisma.conveyance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conveyance Not Found');
  }

  if (isExist.status === 'Approved') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  if (isExist.status === 'Rejected') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Rejected');
  }

  const result = await prisma.conveyance.update({
    where: { id },
    data: { status: 'Approved' },
  });

  return result;
};

// Reject
const rejectSingle = async (id: number): Promise<Conveyance | null> => {
  // check is exist
  const isExist = await prisma.conveyance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conveyance Not Found');
  }

  if (isExist.status === 'Approved') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  if (isExist.status === 'Rejected') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Rejected');
  }

  const result = await prisma.conveyance.update({
    where: { id },
    data: { status: 'Rejected' },
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<Conveyance | null> => {
  // check is exist
  const isExist = await prisma.conveyance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conveyance Not Found');
  }

  if (isExist.status !== 'Pending') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You Cant Delete after Approved/Rejected'
    );
  }

  const result = await prisma.$transaction(async trans => {
    await trans.conveyance.update({
      where: { id },
      data: { conveyanceDetails: { deleteMany: {} } },
    });

    return await trans.conveyance.delete({ where: { id } });
  });

  return result;
};

// get location
const getLocation = async (): Promise<string[]> => {
  const result = await prisma.$queryRaw<{ location: string }[]>`
  SELECT DISTINCT location FROM (
    SELECT [from] AS location 
    FROM [conveyances] 
    WHERE [from] IS NOT NULL AND [from] <> ''
    
    UNION
    
    SELECT [to] AS location 
    FROM [conveyances] 
    WHERE [to] IS NOT NULL AND [to] <> ''
  ) AS combined
`;

  const locations: string[] = result.map(row => row.location);

  return locations;
};

export const ConveyanceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  approveSingle,
  rejectSingle,
  deleteFromDB,
  getLocation,
};
