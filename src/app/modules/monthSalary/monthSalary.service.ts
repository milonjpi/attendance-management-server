import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { MonthSalary, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IMonthSalaryFilters } from './monthSalary.interface';
import moment from 'moment';
import {
  countDaysBetween,
  countTotalDaysBetween,
} from '../../../helpers/neccesseryFunctions';

// create
const insertIntoDB = async (data: MonthSalary): Promise<MonthSalary | null> => {
  const { month, year, locationId } = data;

  const startDate = moment(`${year}-${month}`, 'YYYY-MMMM')
    .startOf('month')
    .format('YYYY-MM-DD');
  const endDate = moment(`${year}-${month}`, 'YYYY-MMMM')
    .endOf('month')
    .format('YYYY-MM-DD');

  const andConditions = [];

  andConditions.push({
    locationId: Number(locationId),
  });

  andConditions.push({
    isActive: true,
  });

  andConditions.push({
    isOwn: false,
  });

  const whereConditions: Prisma.EmployeeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // attendance where condition
  const attendanceConditions: Prisma.AttendanceWhereInput[] = [];
  const leaveConditions: Prisma.LeaveWhereInput[] = [];

  attendanceConditions.push({
    date: {
      gte: moment.utc(`${startDate}T00:00:00Z`).toDate(),
    },
  });
  attendanceConditions.push({
    date: {
      lte: moment.utc(`${endDate}T23:59:59Z`).toDate(),
    },
  });

  leaveConditions.push({
    fromDate: {
      gte: new Date(`${startDate}, 00:00:00`),
    },
  });
  leaveConditions.push({
    fromDate: {
      lte: new Date(`${endDate}, 23:59:59`),
    },
  });

  const attendanceWhereCondition =
    attendanceConditions.length > 0 ? { AND: attendanceConditions } : {};
  const leaveWhereCondition =
    leaveConditions.length > 0 ? { AND: leaveConditions } : {};

  const employees = await prisma.employee.findMany({
    where: whereConditions,
    orderBy: {
      officeId: 'asc',
    },
    include: {
      designation: true,
      department: true,
      location: {
        include: {
          area: true,
        },
      },
      attendances: {
        where: attendanceWhereCondition,
        orderBy: {
          date: 'asc',
        },
      },
      leaves: {
        where: leaveWhereCondition,
      },
      salaries: true,
    },
  });

  const mappedResult = employees?.map(el => {
    // off day count
    let monthDays = 0;
    let totalDays = 0;
    let weekends = 0;

    monthDays = countTotalDaysBetween(
      startDate,
      moment(startDate).endOf('month').format('YYYY-MM-DD')
    );
    totalDays = countTotalDaysBetween(startDate, endDate);
    weekends = countDaysBetween(
      startDate,
      moment(startDate).endOf('month').format('YYYY-MM-DD'),
      el.location.weekend
    );

    const workingDay =
      el.joiningDate &&
      endDate &&
      moment(el.joiningDate).format('YYYYMM') ===
        moment(startDate).format('YYYYMM')
        ? countTotalDaysBetween(
            moment(el.joiningDate).format('YYYY-MM-DD'),
            endDate
          )
        : totalDays;

    const absentDay = monthDays - workingDay;

    const presents = el.attendances?.length || 0;
    const leaves = el.leaves?.length || 0;

    const findSalary = el.salaries?.find(
      bl =>
        parseInt(moment(startDate).format('YYYYMMDD')) >=
          parseInt(moment(bl.fromDate).format('YYYYMMDD')) &&
        (bl.toDate
          ? parseInt(moment(startDate).format('YYYYMMDD')) <=
            parseInt(moment(bl.toDate).format('YYYYMMDD'))
          : true)
    );

    const totalSalary = Math.round(
      ((findSalary?.salary || 0) / monthDays) * workingDay
    );
    const totalDeduction = Math.round(
      ((findSalary?.salary || 0) / monthDays) * absentDay
    );
    return {
      officeId: el.officeId,
      totalDays: monthDays,
      weekends,
      workingDays: workingDay,
      presents,
      lateCounts: 0,
      leaves,
      absents: monthDays - workingDay,
      salary: findSalary?.salary || 0,
      earnSalary: totalSalary,
      deduction: totalDeduction,
      isAccepted: false,
    };
  });

  const result = await prisma.monthSalary.create({
    data: {
      month,
      year,
      locationId,
      monthSalaryDetails: { createMany: { data: mappedResult } },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add');
  }

  return result;
};

// get all
const getAll = async (
  filters: IMonthSalaryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<MonthSalary[]>> => {
  const { locationId, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (locationId) {
    andConditions.push({
      locationId: Number(locationId),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.MonthSalaryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthSalary.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      location: {
        include: {
          area: true,
        },
      },
      monthSalaryDetails: {
        include: {
          employee: {
            include: {
              designation: true,
              department: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.monthSalary.count({
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

// delete
const deleteFromDB = async (id: number): Promise<MonthSalary | null> => {
  // check is exist
  const isExist = await prisma.monthSalary.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Month Salary Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.monthSalary.update({
      where: { id },
      data: { monthSalaryDetails: { deleteMany: {} } },
    });

    return await trans.monthSalary.delete({ where: { id } });
  });

  return result;
};

export const MonthSalaryService = {
  insertIntoDB,
  getAll,
  deleteFromDB,
};
