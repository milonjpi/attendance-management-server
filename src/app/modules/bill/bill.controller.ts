import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Bill } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BillService } from './bill.service';
import { billFilterableFields } from './bill.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { billDetails, ...data } = req.body;

  const result = await BillService.insertIntoDB(data, billDetails);

  sendResponse<Bill>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bill Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, billFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BillService.getAll(filters, paginationOptions);

  sendResponse<Bill[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bills retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await BillService.getSingle(id);

  sendResponse<Bill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bill retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { billDetails, ...data } = req.body;

  const result = await BillService.updateSingle(id, data, billDetails);

  sendResponse<Bill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bill Updated successfully',
    data: result,
  });
});

// approve
const approveSingle = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await BillService.approveSingle(id);

  sendResponse<Bill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bill Approved successfully',
    data: result,
  });
});

// reject
const rejectSingle = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await BillService.rejectSingle(id);

  sendResponse<Bill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bill Rejected successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await BillService.deleteFromDB(id);

  sendResponse<Bill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bill deleted successfully',
    data: result,
  });
});

export const BillController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  approveSingle,
  rejectSingle,
  deleteFromDB,
};
