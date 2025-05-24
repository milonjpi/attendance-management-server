import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Salary } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { SalaryService } from './salary.service';
import { salaryFilterableFields } from './salary.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SalaryService.insertIntoDB(data);

  sendResponse<Salary>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Salary Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, salaryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SalaryService.getAll(filters, paginationOptions);

  sendResponse<Salary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salaries retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await SalaryService.getSingle(id);

  sendResponse<Salary>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salary retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await SalaryService.updateSingle(id, data);

  sendResponse<Salary>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salary Updated successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await SalaryService.deleteFromDB(id);

  sendResponse<Salary>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salary deleted successfully',
    data: result,
  });
});

export const SalaryController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
