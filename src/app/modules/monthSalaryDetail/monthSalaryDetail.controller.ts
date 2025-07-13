import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { MonthSalaryDetail } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { MonthSalaryDetailService } from './monthSalaryDetail.service';
import { monthSalaryDetailFilterableFields } from './monthSalaryDetail.constant';

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, monthSalaryDetailFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await MonthSalaryDetailService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<MonthSalaryDetail[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salaries retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// receive salary
const receiveSalary = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await MonthSalaryDetailService.receiveSalary(id);

  sendResponse<MonthSalaryDetail>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salary Updated successfully',
    data: result,
  });
});

export const MonthSalaryDetailController = {
  getAll,
  receiveSalary,
};
