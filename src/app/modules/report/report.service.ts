import prisma from '../../../shared/prisma';
import { Employee, Prisma } from '@prisma/client';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IEmployeeReportFilters, IEmployeeSalary } from './report.interface';
import { employeeReportSearchableFields } from './report.constant';
import moment from 'moment';
import {
  countDaysBetween,
  countTotalDaysBetween,
} from '../../../helpers/neccesseryFunctions';

// get Employees Report
const getEmployeesReport = async (
  filters: IEmployeeReportFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Employee[]>> => {
  const { searchTerm, startDate, endDate, employeeId, ...filterData } = filters;
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

  if (employeeId) {
    andConditions.push({
      id: Number(employeeId),
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
        orderBy: {
          date: 'asc',
        },
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

// get salary Report
const getSalaryReport = async (
  filters: IEmployeeReportFilters
): Promise<IEmployeeSalary[]> => {
  const { startDate, endDate, locationId, isActive, isOwn, employeeId } =
    filters;

  const andConditions = [];

  if (employeeId) {
    andConditions.push({
      officeId: employeeId,
    });
  }

  if (locationId) {
    andConditions.push({
      locationId: Number(locationId),
    });
  }

  if (isActive) {
    andConditions.push({
      isActive: isActive === 'true' ? true : false,
    });
  }

  if (isOwn) {
    andConditions.push({
      isOwn: isOwn === 'true' ? true : false,
    });
  }

  const whereConditions: Prisma.EmployeeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // attendance where condition
  const attendanceConditions: Prisma.AttendanceWhereInput[] = [];
  const leaveConditions: Prisma.LeaveWhereInput[] = [];

  if (startDate) {
    attendanceConditions.push({
      date: {
        gte: moment.utc(`${startDate}T00:00:00Z`).toDate(),
      },
    });

    leaveConditions.push({
      fromDate: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }

  if (endDate) {
    attendanceConditions.push({
      date: {
        lte: moment.utc(`${endDate}T23:59:59Z`).toDate(),
      },
    });
    leaveConditions.push({
      fromDate: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  const attendanceWhereCondition =
    attendanceConditions.length > 0 ? { AND: attendanceConditions } : {};
  const leaveWhereCondition =
    leaveConditions.length > 0 ? { AND: leaveConditions } : {};

  const result = await prisma.employee.findMany({
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

  const mappedResult = result?.map(el => {
    // off day count
    let monthDays = 0;
    let totalDays = 0;
    let weekends = 0;
    if (startDate && endDate) {
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
    }
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
      fullName: el.name,
      designation: el.designation?.label,
      department: el.department?.label,
      joiningDate: el.joiningDate
        ? moment(el.joiningDate).format('DD/MM/YYYY')
        : 'n/a',
      branch: el.location?.label + ', ' + el.location?.area?.label,
      address: el.location.address || '',
      totalDay: monthDays,
      weekends,
      workingDay,
      presents,
      leaves,
      absent: monthDays - workingDay,
      salary: findSalary?.salary || 0,
      earnSalary: totalSalary,
      deduction: totalDeduction,
    };
  });

  return mappedResult;
};

export const ReportService = {
  getEmployeesReport,
  getSalaryReport,
};
