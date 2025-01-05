import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Department } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// create Department
const createDepartment = async (
  data: Department
): Promise<Department | null> => {
  const result = await prisma.department.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create department');
  }

  return result;
};

// get all Departments
const getDepartments = async (): Promise<Department[]> => {
  const result = await prisma.department.findMany({
    orderBy: {
      label: 'asc',
    },
  });

  return result;
};

// get single department
const getSingleDepartment = async (id: number): Promise<Department | null> => {
  const result = await prisma.department.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single department
const updateDepartment = async (
  id: number,
  payload: Partial<Department>
): Promise<Department | null> => {
  // check is exist
  const isExist = await prisma.department.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department Not Found');
  }

  const result = await prisma.department.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Department');
  }

  return result;
};

// delete department
const deleteDepartment = async (id: number): Promise<Department | null> => {
  // check is exist
  const isExist = await prisma.department.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department Not Found');
  }

  const result = await prisma.department.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DepartmentService = {
  createDepartment,
  getDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
