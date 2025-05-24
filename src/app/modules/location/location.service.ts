import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Location, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ILocationFilters } from './location.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { locationSearchableFields } from './location.constant';

// create Location
const createLocation = async (data: Location): Promise<Location | null> => {
  const result = await prisma.location.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Location');
  }

  return result;
};

// get Locations
const getLocations = async (
  filters: ILocationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Location[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: locationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]:
          value === 'true' ? true : value === 'false' ? false : Number(value),
      })),
    });
  }

  const whereConditions: Prisma.LocationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.location.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      area: true,
    },
  });

  const total = await prisma.location.count({
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

// get single Location
const getSingleLocation = async (id: number): Promise<Location | null> => {
  const result = await prisma.location.findFirst({
    where: {
      id,
    },
    include: { area: true },
  });

  return result;
};

// update single Location
const updateLocation = async (
  id: number,
  payload: Partial<Location>
): Promise<Location | null> => {
  // check is exist
  const isExist = await prisma.location.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
  }

  const result = await prisma.location.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Location');
  }

  return result;
};

// delete Location
const deleteLocation = async (id: number): Promise<Location | null> => {
  // check is exist
  const isExist = await prisma.location.findFirst({
    where: {
      id,
    },
    include: {
      employees: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
  }

  if (isExist.employees.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Location Engaged with ${isExist.employees.length} Docs`
    );
  }

  const result = await prisma.location.delete({
    where: {
      id,
    },
  });

  return result;
};

export const LocationService = {
  createLocation,
  getLocations,
  getSingleLocation,
  updateLocation,
  deleteLocation,
};
