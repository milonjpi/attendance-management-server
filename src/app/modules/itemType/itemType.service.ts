import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ItemType, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IItemTypeFilters } from './itemType.interface';
import { itemTypeSearchableFields } from './itemType.constant';

// create
const insertIntoDB = async (data: ItemType): Promise<ItemType | null> => {
  const result = await prisma.itemType.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Type');
  }

  return result;
};

// get all
const getAll = async (
  filters: IItemTypeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ItemType[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: itemTypeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  const whereConditions: Prisma.ItemTypeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.itemType.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.itemType.count({
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
const getSingle = async (id: number): Promise<ItemType | null> => {
  const result = await prisma.itemType.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<ItemType>
): Promise<ItemType | null> => {
  // check is exist
  const isExist = await prisma.itemType.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Type Not Found');
  }

  const result = await prisma.itemType.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<ItemType | null> => {
  // check is exist
  const isExist = await prisma.itemType.findFirst({
    where: {
      id,
    },
    include: {
      conveyanceDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Type Not Found');
  }

  if (isExist.conveyanceDetails?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Engaged with ${isExist.conveyanceDetails?.length} Docs`
    );
  }

  const result = await prisma.itemType.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ItemTypeService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
