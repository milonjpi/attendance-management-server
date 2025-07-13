import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { MonthSalaryDetail, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IMonthSalaryDetailFilters } from './monthSalaryDetail.interface';

// get all
const getAll = async (
  filters: IMonthSalaryDetailFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<MonthSalaryDetail[]>> => {
  const { month, year, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (month) {
    andConditions.push({
      monthSalary: { month },
    });
  }

  if (year) {
    andConditions.push({
      monthSalary: { year },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.MonthSalaryDetailWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthSalaryDetail.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      monthSalary: {
        include: {
          location: {
            include: { area: true },
          },
        },
      },
    },
  });

  const total = await prisma.monthSalaryDetail.count({
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

// receive Salary
const receiveSalary = async (id: number): Promise<MonthSalaryDetail | null> => {
  // check is exist
  const isExist = await prisma.monthSalaryDetail.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary Not Found');
  }

  const result = await prisma.monthSalaryDetail.update({
    where: {
      id,
    },
    data: {
      isAccepted: true,
    },
  });

  return result;
};

export const MonthSalaryDetailService = {
  getAll,
  receiveSalary,
};
