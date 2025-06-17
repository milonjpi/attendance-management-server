import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { VehicleType } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { VehicleTypeService } from './vehicleType.service';
import { vehicleTypeFilterableFields } from './vehicleType.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await VehicleTypeService.insertIntoDB(data);

  sendResponse<VehicleType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vehicle Type Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, vehicleTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await VehicleTypeService.getAll(filters, paginationOptions);

  sendResponse<VehicleType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle Types retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await VehicleTypeService.getSingle(id);

  sendResponse<VehicleType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle Type retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await VehicleTypeService.updateSingle(id, data);

  sendResponse<VehicleType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle Type Updated successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await VehicleTypeService.deleteFromDB(id);

  sendResponse<VehicleType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle Type deleted successfully',
    data: result,
  });
});

export const VehicleTypeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
