import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Designation } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// create designation
const createDesignation = async (
  data: Designation
): Promise<Designation | null> => {
  const result = await prisma.designation.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create designation');
  }

  return result;
};

// get all Designations
const getDesignations = async (): Promise<Designation[]> => {
  const result = await prisma.designation.findMany({
    orderBy: {
      label: 'asc',
    },
  });

  return result;
};

// get single designation
const getSingleDesignation = async (
  id: string
): Promise<Designation | null> => {
  const result = await prisma.designation.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update single designation
const updateDesignation = async (
  id: string,
  payload: Partial<Designation>
): Promise<Designation | null> => {
  // check is exist
  const isExist = await prisma.designation.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Designation Not Found');
  }

  const result = await prisma.designation.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Designation');
  }

  return result;
};

// delete designation
const deleteDesignation = async (id: string): Promise<Designation | null> => {
  // check is exist
  const isExist = await prisma.designation.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Designation Not Found');
  }

  const result = await prisma.designation.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DesignationService = {
  createDesignation,
  getDesignations,
  getSingleDesignation,
  updateDesignation,
  deleteDesignation,
};
