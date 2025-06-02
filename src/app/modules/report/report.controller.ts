import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { employeeReportFilterableFields } from './report.constant';
import { paginationFields } from '../../../constants/pagination';
import { ReportService } from './report.service';
import sendResponse from '../../../shared/sendResponse';
import { Employee } from '@prisma/client';
import httpStatus from 'http-status';
import { IEmployeeSalary } from './report.interface';

// get all Employees
const getEmployeesReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, employeeReportFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ReportService.getEmployeesReport(
    filters,
    paginationOptions
  );

  sendResponse<Employee[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employees retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get employees salary
const getSalaryReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, employeeReportFilterableFields);

  const result = await ReportService.getSalaryReport(filters);

  sendResponse<IEmployeeSalary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salary retrieved successfully',
    data: result,
  });
});

export const ReportController = {
  getEmployeesReport,
  getSalaryReport,
};
