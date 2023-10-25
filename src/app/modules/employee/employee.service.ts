import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Employee, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { generateEmployeeId } from './employee.utils';
import { IEmployeeFilters } from './employee.interface';
import { employeeSearchableFields } from './employee.constant';
import path from 'path';
import { unlinkSync } from 'fs';

// create Employee
const createEmployee = async (data: Employee): Promise<Employee | null> => {
  // generate Employee id
  const newEmployeeId = await generateEmployeeId();
  data.id = newEmployeeId;

  const result = await prisma.employee.create({ data });

  if (!result) {
    unlinkSync(
      path.join(process.cwd(), `public/uploads/employees/${data?.photo}`)
    );
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Employee');
  }

  return result;
};

// get all Employees
const getAllEmployees = async (
  filters: IEmployeeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Employee[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: employeeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.EmployeeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.employee.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.employee.count({
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

// get single Employee
const getSingleEmployee = async (id: string): Promise<Employee | null> => {
  const result = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update Employee
const updateEmployee = async (
  id: string,
  data: Partial<Employee>
): Promise<Employee | null> => {
  // check is exist
  const isExist = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  const result = await prisma.employee.update({
    where: {
      id,
    },
    data,
  });

  if (data?.photo && isExist?.photo) {
    unlinkSync(
      path.join(process.cwd(), `public/uploads/employees/${isExist?.photo}`)
    );
  }

  return result;
};

// inActive Employee
const inActiveEmployee = async (id: string): Promise<Employee | null> => {
  // check is exist
  const isExist = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  const result = await prisma.employee.update({
    where: {
      id,
    },
    data: { isActive: false },
  });

  return result;
};

export const EmployeeService = {
  createEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  inActiveEmployee,
};
