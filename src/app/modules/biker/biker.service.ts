import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Biker, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { generateBikerId } from './biker.utils';
import { IBikerFilters } from './biker.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { bikerSearchableFields } from './biker.constant';

// create biker
const createBiker = async (data: Biker): Promise<Biker | null> => {
  // generate biker id
  const newBikerId = await generateBikerId();
  data.bikerId = newBikerId;

  const result = await prisma.biker.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Biker');
  }

  return result;
};

// get all bikers
const getAllBikers = async (
  filters: IBikerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Biker[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, size, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: bikerSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.BikerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.biker.findMany({
    where: whereConditions,
    skip,
    take: size,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.biker.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / size);

  return {
    meta: {
      page,
      size,
      total,
      totalPage,
    },
    data: result,
  };
};

// get single Biker
const getSingleBiker = async (id: string): Promise<Biker | null> => {
  const result = await prisma.biker.findUnique({
    where: {
      id,
    },
    include: {
      standLogs: true,
    },
  });

  return result;
};

// inActive Biker
const inActiveBiker = async (id: string): Promise<Biker | null> => {
  // check is exist
  const isExist = await prisma.biker.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biker Not Found');
  }

  const result = await prisma.biker.update({
    where: {
      id,
    },
    data: { isActive: false },
  });

  return result;
};

export const BikerService = {
  createBiker,
  getAllBikers,
  getSingleBiker,
  inActiveBiker,
};
