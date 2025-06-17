import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Item } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ItemService } from './item.service';
import { itemFilterableFields } from './item.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ItemService.insertIntoDB(data);

  sendResponse<Item>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, itemFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ItemService.getAll(filters, paginationOptions);

  sendResponse<Item[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Items retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await ItemService.getSingle(id);

  sendResponse<Item>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await ItemService.updateSingle(id, data);

  sendResponse<Item>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item Updated successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await ItemService.deleteFromDB(id);

  sendResponse<Item>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item deleted successfully',
    data: result,
  });
});

export const ItemController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
