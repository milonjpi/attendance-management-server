import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Department } from '@prisma/client';
import { DepartmentService } from './department.service';

// create department
const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DepartmentService.createDepartment(data);

  sendResponse<Department>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Department Created Successfully',
    data: result,
  });
});

// get all departments
const getDepartments = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.getDepartments();

  sendResponse<Department[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Departments retrieved successfully',
    data: result,
  });
});

// get single Department
const getSingleDepartment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DepartmentService.getSingleDepartment(id);

  sendResponse<Department>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department retrieved successfully',
    data: result,
  });
});

// update single department
const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DepartmentService.updateDepartment(id, data);

  sendResponse<Department>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Department Updated Successfully',
    data: result,
  });
});

// delete department
const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DepartmentService.deleteDepartment(id);

  sendResponse<Department>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department deleted successfully',
    data: result,
  });
});

export const DepartmentController = {
  createDepartment,
  getDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
