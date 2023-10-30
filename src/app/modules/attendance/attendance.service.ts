import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Attendance, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IAttendanceFilters } from './attendance.interface';
import moment from 'moment';

// create attendance
const createAttendance = async (
  data: Attendance
): Promise<Attendance | null> => {
  data.realPunch = false;

  const isExist = await prisma.attendance.findFirst({
    where: {
      employeeId: data?.employeeId,
      inTime: {
        gte: new Date(`${moment(data?.inTime).format('YYYY-MM-DD')}, 00:00:00`),
        lte: new Date(`${moment(data?.inTime).format('YYYY-MM-DD')}, 23:59:59`),
      },
    },
  });

  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Present');
  }

  const result = await prisma.attendance.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Attendance');
  }

  return result;
};

// get all attendance
const getAllAttendances = async (
  filters: IAttendanceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Attendance[]>> => {
  const { startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  andConditions.push({
    realPunch: false,
  });

  if (startDate) {
    andConditions.push({
      inTime: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      inTime: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.AttendanceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.attendance.findMany({
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
          location: true,
        },
      },
    },
  });

  const total = await prisma.attendance.count({
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

// delete Attendance
const deleteAttendance = async (id: number): Promise<Attendance | null> => {
  // check is exist
  const isExist = await prisma.attendance.findUnique({
    where: {
      id,
      realPunch: false,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attendance Not Found');
  }

  const result = await prisma.attendance.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AttendanceService = {
  createAttendance,
  getAllAttendances,
  deleteAttendance,
};
