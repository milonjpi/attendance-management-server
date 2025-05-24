import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Salary, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { ISalaryFilters } from './salary.interface';
import { salarySearchableFields } from './salary.constant';

// create
const insertIntoDB = async (data: Salary): Promise<Salary | null> => {
  const result = await prisma.salary.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Salary');
  }

  return result;
};

// get all
const getAll = async (
  filters: ISalaryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Salary[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: salarySearchableFields.map(field => ({
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

  const whereConditions: Prisma.SalaryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.salary.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      employee: {
        include: {
          designation: true,
          department: true,
          location: {
            include: {
              area: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.salary.count({
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
const getSingle = async (id: number): Promise<Salary | null> => {
  const result = await prisma.salary.findFirst({
    where: {
      id,
    },
    include: {
      employee: {
        include: {
          designation: true,
          department: true,
          location: {
            include: {
              area: true,
            },
          },
        },
      },
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<Salary>
): Promise<Salary | null> => {
  // check is exist
  const isExist = await prisma.salary.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary Not Found');
  }

  const result = await prisma.salary.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<Salary | null> => {
  // check is exist
  const isExist = await prisma.salary.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary Not Found');
  }

  const result = await prisma.salary.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SalaryService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
