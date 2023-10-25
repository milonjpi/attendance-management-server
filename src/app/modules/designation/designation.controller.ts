import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Designation } from '@prisma/client';
import { DesignationService } from './designation.service';

// create designation
const createDesignation = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DesignationService.createDesignation(data);

  sendResponse<Designation>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Designation Created Successfully',
    data: result,
  });
});

// get all designations
const getDesignations = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignationService.getDesignations();

  sendResponse<Designation[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Designations retrieved successfully',
    data: result,
  });
});

// get single Designation
const getSingleDesignation = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await DesignationService.getSingleDesignation(id);

  sendResponse<Designation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Designation retrieved successfully',
    data: result,
  });
});

// update single designation
const updateDesignation = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  const result = await DesignationService.updateDesignation(id, data);

  sendResponse<Designation>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Designation Updated Successfully',
    data: result,
  });
});

// delete designation
const deleteDesignation = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await DesignationService.deleteDesignation(id);

  sendResponse<Designation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Designation deleted successfully',
    data: result,
  });
});

export const DesignationController = {
  createDesignation,
  getDesignations,
  getSingleDesignation,
  updateDesignation,
  deleteDesignation,
};
