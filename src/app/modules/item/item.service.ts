import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Item, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IItemFilters } from './item.interface';
import { itemSearchableFields } from './item.constant';

// create
const insertIntoDB = async (data: Item): Promise<Item | null> => {
  const result = await prisma.item.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add');
  }

  return result;
};

// get all
const getAll = async (
  filters: IItemFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Item[]>> => {
  const { searchTerm, isService } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: itemSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  if (isService) {
    andConditions.push({
      isService: isService === 'true' ? true : false,
    });
  }

  const whereConditions: Prisma.ItemWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.item.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.item.count({
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
const getSingle = async (id: number): Promise<Item | null> => {
  const result = await prisma.item.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<Item>
): Promise<Item | null> => {
  // check is exist
  const isExist = await prisma.item.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.item.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<Item | null> => {
  // check is exist
  const isExist = await prisma.item.findFirst({
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

  const result = await prisma.item.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ItemService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
