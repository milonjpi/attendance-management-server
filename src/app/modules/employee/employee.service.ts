import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import prisma from '../../../shared/prisma';
import { Employee, EmployeeLocation, Prisma, User } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IEmployeeFilters } from './employee.interface';
import { employeeSearchableFields } from './employee.constant';
import path from 'path';
import { unlinkSync } from 'fs';
import config from '../../../config';

// create Employee
const createEmployee = async (data: Employee): Promise<Employee | null> => {
  const result = await prisma.employee.create({ data });

  if (!result) {
    unlinkSync(
      path.join(process.cwd(), `public/uploads/employees/${data?.photo}`)
    );
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Employee');
  }

  return result;
};

// create user
const createUser = async (data: User): Promise<User | null> => {
  // hashing password
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.$transaction(async trans => {
    await trans.employee.update({
      where: { officeId: data.userName },
      data: { userCreated: true },
    });

    return await trans.user.create({ data });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }

  return result;
};

// get all Employees
const getAllEmployees = async (
  filters: IEmployeeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Employee[]>> => {
  const { searchTerm, areaId, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: employeeSearchableFields.map(field => ({
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

  if (areaId) {
    andConditions.push({
      location: { areaId: Number(areaId) },
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
    include: {
      designation: true,
      department: true,
      location: {
        include: {
          area: true,
        },
      },
      employeeLocations: {
        include: {
          location: {
            include: {
              area: true,
            },
          },
        },
      },
    },
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
const getSingleEmployee = async (id: number): Promise<Employee | null> => {
  const result = await prisma.employee.findFirst({
    where: {
      id,
    },
    include: {
      designation: true,
      department: true,
      location: {
        include: {
          area: true,
        },
      },
      employeeLocations: {
        include: {
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

// get single user Employee
const getSingleUserEmployee = async (
  officeId: string
): Promise<Employee | null> => {
  const result = await prisma.employee.findFirst({
    where: {
      officeId,
    },
    include: {
      designation: true,
      department: true,
      location: {
        include: {
          area: true,
        },
      },
      employeeLocations: {
        include: {
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

// update Employee
const updateEmployee = async (
  id: number,
  data: Partial<Employee>
): Promise<Employee | null> => {
  // check is exist
  const isExist = await prisma.employee.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  if (isExist.userCreated) {
    delete data.officeId;
  }

  const result = await prisma.$transaction(async trans => {
    const findUser = await trans.user.findFirst({
      where: { userName: isExist?.officeId },
    });
    if (findUser) {
      await trans.user.update({
        where: { userName: isExist.officeId },
        data: { fullName: data.name || isExist.name },
      });
    }

    return await trans.employee.update({ where: { id }, data: data });
  });

  if (data?.photo && isExist?.photo) {
    unlinkSync(
      path.join(process.cwd(), `public/uploads/employees/${isExist?.photo}`)
    );
  }

  return result;
};

// update additional location
const updateAdditionalLocation = async (
  id: number,
  data: EmployeeLocation[]
): Promise<Employee | null> => {
  // check is exist
  const isExist = await prisma.employee.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.employee.update({
      where: { id },
      data: { employeeLocations: { deleteMany: {} } },
    });
    return await trans.employee.update({
      where: { id },
      data: { employeeLocations: { createMany: { data: data } } },
    });
  });

  return result;
};

export const EmployeeService = {
  createEmployee,
  createUser,
  getAllEmployees,
  getSingleEmployee,
  getSingleUserEmployee,
  updateEmployee,
  updateAdditionalLocation,
};
