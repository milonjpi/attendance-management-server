import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Area } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { AreaService } from './area.service';
import { areaFilterableFields } from './area.constant';

// create Area
const createArea = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AreaService.createArea(data);

  sendResponse<Area>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Area Added Successfully',
    data: result,
  });
});

// get all Areas
const getAllAreas = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, areaFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AreaService.getAllAreas(filters, paginationOptions);

  sendResponse<Area[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Areas retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single Area
const getSingleArea = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await AreaService.getSingleArea(id);

  sendResponse<Area>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Area retrieved successfully',
    data: result,
  });
});

// update Area
const updateArea = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await AreaService.updateArea(id, data);

  sendResponse<Area>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Area Updated successfully',
    data: result,
  });
});

// delete area
const deleteArea = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await AreaService.deleteArea(id);

  sendResponse<Area>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Area deleted successfully',
    data: result,
  });
});

export const AreaController = {
  createArea,
  getAllAreas,
  getSingleArea,
  updateArea,
  deleteArea,
};
