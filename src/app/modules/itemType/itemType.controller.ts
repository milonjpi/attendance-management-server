import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ItemType } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ItemTypeService } from './itemType.service';
import { itemTypeFilterableFields } from './itemType.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ItemTypeService.insertIntoDB(data);

  sendResponse<ItemType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Type Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, itemTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ItemTypeService.getAll(filters, paginationOptions);

  sendResponse<ItemType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Types retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await ItemTypeService.getSingle(id);

  sendResponse<ItemType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Type retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await ItemTypeService.updateSingle(id, data);

  sendResponse<ItemType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Type Updated successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await ItemTypeService.deleteFromDB(id);

  sendResponse<ItemType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Type deleted successfully',
    data: result,
  });
});

export const ItemTypeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
