import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Uom, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUomFilters } from './uom.interface';
import { uomSearchableFields } from './uom.constant';

// create
const insertIntoDB = async (data: Uom): Promise<Uom | null> => {
  const result = await prisma.uom.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add');
  }

  return result;
};

// get all
const getAll = async (
  filters: IUomFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Uom[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: uomSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  const whereConditions: Prisma.UomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.uom.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.uom.count({
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
const getSingle = async (id: number): Promise<Uom | null> => {
  const result = await prisma.uom.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<Uom>
): Promise<Uom | null> => {
  // check is exist
  const isExist = await prisma.uom.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.uom.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<Uom | null> => {
  // check is exist
  const isExist = await prisma.uom.findFirst({
    where: {
      id,
    },
    include: {
      billDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.billDetails?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Engaged with ${isExist.billDetails?.length} Docs`
    );
  }

  const result = await prisma.uom.delete({
    where: {
      id,
    },
  });

  return result;
};

export const UomService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
