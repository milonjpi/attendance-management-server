import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Area, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IAreaFilters } from './area.interface';
import { areaSearchableFields } from './area.constant';

// create Area
const createArea = async (data: Area): Promise<Area | null> => {
  const result = await prisma.area.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Area');
  }

  return result;
};

// get all Areas
const getAllAreas = async (
  filters: IAreaFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Area[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: areaSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  const whereConditions: Prisma.AreaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.area.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.area.count({
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

// get single Area
const getSingleArea = async (id: number): Promise<Area | null> => {
  const result = await prisma.area.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update Area
const updateArea = async (
  id: number,
  data: Partial<Area>
): Promise<Area | null> => {
  // check is exist
  const isExist = await prisma.area.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area Not Found');
  }

  const result = await prisma.area.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete area
const deleteArea = async (id: number): Promise<Area | null> => {
  // check is exist
  const isExist = await prisma.area.findFirst({
    where: {
      id,
    },
    include: {
      locations: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area Not Found');
  }

  if (isExist.locations?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Area Engaged With ${isExist.locations?.length} Dovs`
    );
  }

  const result = await prisma.area.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AreaService = {
  createArea,
  getAllAreas,
  getSingleArea,
  updateArea,
  deleteArea,
};
