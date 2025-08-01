import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Uom } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { UomService } from './uom.service';
import { uomFilterableFields } from './uom.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await UomService.insertIntoDB(data);

  sendResponse<Uom>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Uom Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, uomFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UomService.getAll(filters, paginationOptions);

  sendResponse<Uom[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await UomService.getSingle(id);

  sendResponse<Uom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await UomService.updateSingle(id, data);

  sendResponse<Uom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom Updated successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await UomService.deleteFromDB(id);

  sendResponse<Uom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom deleted successfully',
    data: result,
  });
});

export const UomController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
