import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Location } from '@prisma/client';
import { LocationService } from './location.service';
import pick from '../../../shared/pick';
import { locationFilterableFields } from './location.constant';
import { paginationFields } from '../../../constants/pagination';

// create Location
const createLocation = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await LocationService.createLocation(data);

  sendResponse<Location>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Branch Created Successfully',
    data: result,
  });
});

// get all Locations
const getLocations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, locationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await LocationService.getLocations(filters, paginationOptions);

  sendResponse<Location[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Branches retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single Location
const getSingleLocation = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await LocationService.getSingleLocation(id);

  sendResponse<Location>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Branch retrieved successfully',
    data: result,
  });
});

// update single Location
const updateLocation = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  const result = await LocationService.updateLocation(id, data);

  sendResponse<Location>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Branch Updated Successfully',
    data: result,
  });
});

// delete Location
const deleteLocation = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await LocationService.deleteLocation(id);

  sendResponse<Location>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Branch deleted successfully',
    data: result,
  });
});

export const LocationController = {
  createLocation,
  getLocations,
  getSingleLocation,
  updateLocation,
  deleteLocation,
};
