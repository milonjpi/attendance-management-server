import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Location } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// create Location
const createLocation = async (data: Location): Promise<Location | null> => {
  const result = await prisma.location.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Location');
  }

  return result;
};

// get all Locations
const getLocations = async (): Promise<Location[]> => {
  const result = await prisma.location.findMany({
    orderBy: {
      label: 'asc',
    },
  });

  return result;
};

// get single Location
const getSingleLocation = async (id: number): Promise<Location | null> => {
  const result = await prisma.location.findFirst({
    where: {
      id,
    },
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
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
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
