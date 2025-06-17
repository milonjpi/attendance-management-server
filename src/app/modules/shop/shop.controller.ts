import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Shop } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ShopService } from './shop.service';
import { shopFilterableFields } from './shop.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ShopService.insertIntoDB(data);

  sendResponse<Shop>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Shop Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, shopFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ShopService.getAll(filters, paginationOptions);

  sendResponse<Shop[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shops retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await ShopService.getSingle(id);

  sendResponse<Shop>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await ShopService.updateSingle(id, data);

  sendResponse<Shop>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Updated successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await ShopService.deleteFromDB(id);

  sendResponse<Shop>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop deleted successfully',
    data: result,
  });
});

export const ShopController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
