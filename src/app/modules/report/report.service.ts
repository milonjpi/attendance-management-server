import prisma from '../../../shared/prisma';
import { Employee, Prisma } from '@prisma/client';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IEmployeeReportFilters } from './report.interface';
import { employeeReportSearchableFields } from './report.constant';
import moment from 'moment';

// get Employees Report
const getEmployeesReport = async (
  filters: IEmployeeReportFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Employee[]>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: employeeReportSearchableFields.map(field => ({
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

  const whereConditions: Prisma.EmployeeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // attendance where condition
  const attendanceConditions: Prisma.AttendanceWhereInput[] = [];

  if (startDate) {
    attendanceConditions.push({
      date: {
        gte: moment.utc(`${startDate}T00:00:00Z`).toDate(),
      },
    });
  }

  if (endDate) {
    attendanceConditions.push({
      date: {
        lte: moment.utc(`${endDate}T23:59:59Z`).toDate(),
      },
    });
  }

  const attendanceWhereCondition =
    attendanceConditions.length > 0 ? { AND: attendanceConditions } : {};

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
      attendances: {
        where: attendanceWhereCondition,
      },
      leaves: true,
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

export const ReportService = {
  getEmployeesReport,
};
