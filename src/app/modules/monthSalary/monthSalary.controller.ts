import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { MonthSalary } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { MonthSalaryService } from './monthSalary.service';
import { monthSalaryFilterableFields } from './monthSalary.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await MonthSalaryService.insertIntoDB(data);

  sendResponse<MonthSalary>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Month Salary Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, monthSalaryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await MonthSalaryService.getAll(filters, paginationOptions);

  sendResponse<MonthSalary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salaries retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await MonthSalaryService.deleteFromDB(id);

  sendResponse<MonthSalary>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Month Salary deleted successfully',
    data: result,
  });
});

export const MonthSalaryController = {
  insertIntoDB,
  getAll,
  deleteFromDB,
};
