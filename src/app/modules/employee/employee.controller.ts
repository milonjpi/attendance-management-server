import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Employee } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { EmployeeService } from './employee.service';
import { employeeFilterableFields } from './employee.constant';

// create Employee
const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await EmployeeService.createEmployee(data);

  sendResponse<Employee>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Employee Added Successfully',
    data: result,
  });
});

// get all Employees
const getAllEmployees = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, employeeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EmployeeService.getAllEmployees(
    filters,
    paginationOptions
  );

  sendResponse<Employee[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employees retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single active Employee
const getSingleActiveEmployee = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await EmployeeService.getSingleActiveEmployee(id);

    sendResponse<Employee>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee retrieved successfully',
      data: result,
    });
  }
);

// get single inactive Employee
const getSingleInactiveEmployee = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await EmployeeService.getSingleInactiveEmployee(id);

    sendResponse<Employee>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee retrieved successfully',
      data: result,
    });
  }
);

// update Employee
const updateEmployee = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await EmployeeService.updateEmployee(id, data);

  sendResponse<Employee>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Updated successfully',
    data: result,
  });
});

// inActiveEmployee Employee
const inActiveEmployee = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EmployeeService.inActiveEmployee(id);

  sendResponse<Employee>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Inactive successfully',
    data: result,
  });
});

export const EmployeeController = {
  createEmployee,
  getAllEmployees,
  getSingleActiveEmployee,
  getSingleInactiveEmployee,
  updateEmployee,
  inActiveEmployee,
};
