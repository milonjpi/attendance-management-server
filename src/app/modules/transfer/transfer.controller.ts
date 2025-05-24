import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Transfer } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { TransferService } from './transfer.service';
import { transferFilterableFields } from './transfer.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await TransferService.insertIntoDB(data);

  sendResponse<Transfer>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Transfer Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, transferFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TransferService.getAll(filters, paginationOptions);

  sendResponse<Transfer[]>(res, {
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

  const result = await TransferService.getSingle(id);

  sendResponse<Transfer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await TransferService.updateSingle(id, data);

  sendResponse<Transfer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer Updated successfully',
    data: result,
  });
});

// approve
const approveSingle = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await TransferService.approveSingle(id);

  sendResponse<Transfer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer Approved successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await TransferService.deleteFromDB(id);

  sendResponse<Transfer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transfer deleted successfully',
    data: result,
  });
});

export const TransferController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  approveSingle,
  deleteFromDB,
};
