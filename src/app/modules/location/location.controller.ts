import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Location } from '@prisma/client';
import { LocationService } from './location.service';

// create Location
const createLocation = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await LocationService.createLocation(data);

  sendResponse<Location>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Location Created Successfully',
    data: result,
  });
});

// get all Locations
const getLocations = catchAsync(async (req: Request, res: Response) => {
  const result = await LocationService.getLocations();

  sendResponse<Location[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Locations retrieved successfully',
    data: result,
  });
});

// get single Location
const getSingleLocation = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await LocationService.getSingleLocation(id);

  sendResponse<Location>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Location retrieved successfully',
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
    message: 'Location Updated Successfully',
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
    message: 'Location deleted successfully',
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
