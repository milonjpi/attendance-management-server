import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { VehicleType, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IVehicleTypeFilters } from './vehicleType.interface';
import { vehicleTypeSearchableFields } from './vehicleType.constant';

// create
const insertIntoDB = async (data: VehicleType): Promise<VehicleType | null> => {
  const result = await prisma.vehicleType.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add');
  }

  return result;
};

// get all
const getAll = async (
  filters: IVehicleTypeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<VehicleType[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: vehicleTypeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  const whereConditions: Prisma.VehicleTypeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.vehicleType.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.vehicleType.count({
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

// get single
const getSingle = async (id: number): Promise<VehicleType | null> => {
  const result = await prisma.vehicleType.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<VehicleType>
): Promise<VehicleType | null> => {
  // check is exist
  const isExist = await prisma.vehicleType.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.vehicleType.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<VehicleType | null> => {
  // check is exist
  const isExist = await prisma.vehicleType.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.vehicleType.delete({
    where: {
      id,
    },
  });

  return result;
};

export const VehicleTypeService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
