import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Leave } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { LeaveService } from './leave.service';
import { leaveFilterableFields } from './leave.constant';

// create Leave
const createLeave = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await LeaveService.createLeave(data);

  sendResponse<Leave>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Leave Added Successfully',
    data: result,
  });
});

// get all Leaves
const getAllLeaves = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, leaveFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await LeaveService.getAllLeaves(filters, paginationOptions);

  sendResponse<Leave[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leaves retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single Leave
const getSingleLeave = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await LeaveService.getSingleLeave(id);

  sendResponse<Leave>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leave retrieved successfully',
    data: result,
  });
});

// update Leave
const updateLeave = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const result = await LeaveService.updateLeave(id, data);

  sendResponse<Leave>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leave Updated successfully',
    data: result,
  });
});

// delete leave
const deleteLeave = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await LeaveService.deleteLeave(id);

  sendResponse<Leave>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leave deleted successfully',
    data: result,
  });
});

export const LeaveController = {
  createLeave,
  getAllLeaves,
  getSingleLeave,
  updateLeave,
  deleteLeave,
};
