import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Attendance, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  IAttendanceFilters,
  ISingleAttendanceFilters,
} from './attendance.interface';
import moment from 'moment';

// create attendance
const createAttendance = async (
  data: Attendance
): Promise<Attendance | null> => {
  data.realPunch = false;

  const isExist = await prisma.attendance.findFirst({
    where: {
      officeId: data?.officeId,
      date: {
        gte: moment.utc(data.date).startOf('day').toDate(),
        lte: moment.utc(data.date).endOf('day').toDate(),
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

// create geo attendance
const createGeoAttendance = async (
  data: Attendance
): Promise<Attendance | null> => {
  const user = await prisma.user.findFirst({
    where: { userName: data?.officeId },
  });

  const isExist = await prisma.attendance.findFirst({
    where: {
      officeId: data?.officeId,
      date: {
        gte: moment.utc(data.date).startOf('day').toDate(),
        lte: moment.utc(data.date).endOf('day').toDate(),
      },
    },
  });

  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Present');
  }

  if (user?.deviceId && user.deviceId !== data.deviceId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Device Mismatched');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.user.update({
      where: { id: user?.id },
      data: { deviceId: data?.deviceId },
    });

    return await trans.attendance.create({ data });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Attendance');
  }

  return result;
};

// create geo leave
const createGeoLeave = async (data: Attendance): Promise<Attendance | null> => {
  const user = await prisma.user.findFirst({
    where: { userName: data?.officeId },
  });

  const isExist = await prisma.attendance.findFirst({
    where: {
      officeId: data?.officeId,
      date: {
        gte: moment.utc(data.date).startOf('day').toDate(),
        lte: moment.utc(data.date).endOf('day').toDate(),
      },
    },
  });

  if (user?.deviceId && user.deviceId !== data.deviceId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Device Mismatched');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.user.update({
      where: { id: user?.id },
      data: { deviceId: data?.deviceId },
    });

    if (isExist) {
      return await trans.attendance.update({ where: { id: isExist.id }, data });
    }

    return await trans.attendance.create({ data });
  });

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
  const { startDate, endDate, locationId, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  andConditions.push({
    realPunch: false,
  });

  if (startDate) {
    andConditions.push({
      date: {
        gte: moment.utc(`${startDate}T00:00:00Z`).toDate(),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      date: {
        lte: moment.utc(`${endDate}T23:59:59Z`).toDate(),
      },
    });
  }

  if (locationId) {
    andConditions.push({
      employee: { locationId: Number(locationId) },
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
          location: {
            include: {
              area: true,
            },
          },
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

// get single attendance
const getSingleAttendances = async (
  filters: ISingleAttendanceFilters
): Promise<Attendance | null> => {
  const { startDate, endDate, officeId } = filters;
  const andConditions = [];

  if (officeId) {
    andConditions.push({
      officeId,
    });
  }

  if (startDate) {
    andConditions.push({
      date: {
        gte: moment.utc(`${startDate}T00:00:00Z`).toDate(),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      date: {
        lte: moment.utc(`${endDate}T23:59:59Z`).toDate(),
      },
    });
  }

  const whereConditions: Prisma.AttendanceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.attendance.findFirst({
    where: whereConditions,
  });

  return result;
};

// delete Attendance
const deleteAttendance = async (id: number): Promise<Attendance | null> => {
  // check is exist
  const isExist = await prisma.attendance.findFirst({
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
  createGeoAttendance,
  createGeoLeave,
  getAllAttendances,
  getSingleAttendances,
  deleteAttendance,
};
