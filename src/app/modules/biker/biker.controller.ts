import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Biker } from '@prisma/client';
import { BikerService } from './biker.service';
import pick from '../../../shared/pick';
import { bikerFilterableFields } from './biker.constant';
import { paginationFields } from '../../../constants/pagination';

// create biker
const createBiker = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BikerService.createBiker(data);

  sendResponse<Biker>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Biker Added Successfully',
    data: result,
  });
});

// get all Bikers
const getAllBikers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bikerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BikerService.getAllBikers(filters, paginationOptions);

  sendResponse<Biker[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single Biker
const getSingleBiker = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BikerService.getSingleBiker(id);

  sendResponse<Biker>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biker retrieved successfully',
    data: result,
  });
});

// inActiveBiker Biker
const inActiveBiker = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BikerService.inActiveBiker(id);

  sendResponse<Biker>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biker Inactive successfully',
    data: result,
  });
});

export const BikerController = {
  createBiker,
  getAllBikers,
  getSingleBiker,
  inActiveBiker,
};
