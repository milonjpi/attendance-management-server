import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Conveyance } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ConveyanceService } from './conveyance.service';
import { conveyanceFilterableFields } from './conveyance.constant';
import { IConveyanceResponse } from './conveyance.interface';
import { JwtPayload } from 'jsonwebtoken';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { conveyanceDetails, ...data } = req.body;

  const userData = req.user as JwtPayload;

  data.userId = userData?.id;

  const result = await ConveyanceService.insertIntoDB(data, conveyanceDetails);

  sendResponse<Conveyance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Conveyance Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, conveyanceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ConveyanceService.getAll(filters, paginationOptions);

  sendResponse<IConveyanceResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conveyances retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await ConveyanceService.getSingle(id);

  sendResponse<Conveyance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conveyance retrieved successfully',
    data: result,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { conveyanceDetails, ...data } = req.body;

  const result = await ConveyanceService.updateSingle(
    id,
    data,
    conveyanceDetails
  );

  sendResponse<Conveyance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conveyance Updated successfully',
    data: result,
  });
});

// approve
const approveSingle = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  const result = await ConveyanceService.approveSingle(id, data);

  sendResponse<Conveyance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conveyance Approved successfully',
    data: result,
  });
});

// reject
const rejectSingle = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  const result = await ConveyanceService.rejectSingle(id, data);

  sendResponse<Conveyance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conveyance Rejected successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await ConveyanceService.deleteFromDB(id);

  sendResponse<Conveyance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conveyance deleted successfully',
    data: result,
  });
});

// get locations
const getLocation = catchAsync(async (req: Request, res: Response) => {
  const result = await ConveyanceService.getLocation();

  sendResponse<string[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Locations retrieved successfully',
    data: result,
  });
});

export const ConveyanceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  approveSingle,
  rejectSingle,
  deleteFromDB,
  getLocation,
};
