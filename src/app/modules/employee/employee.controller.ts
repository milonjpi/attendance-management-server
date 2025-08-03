import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Employee, User } from '@prisma/client';
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

const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await EmployeeService.createUser(data);

  sendResponse<User>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Created Successfully',
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

// get single Employee
const getSingleEmployee = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await EmployeeService.getSingleEmployee(id);

  sendResponse<Employee>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee retrieved successfully',
    data: result,
  });
});

// get single user Employee
const getSingleUserEmployee = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await EmployeeService.getSingleUserEmployee(id);

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
  const id = Number(req.params.id);
  const data = req.body;

  const result = await EmployeeService.updateEmployee(id, data);

  sendResponse<Employee>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Updated successfully',
    data: result,
  });
});

// update additional location
const updateAdditionalLocation = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { employeeLocations } = req.body;

    const result = await EmployeeService.updateAdditionalLocation(
      id,
      employeeLocations
    );

    sendResponse<Employee>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Location Updated successfully',
      data: result,
    });
  }
);

export const EmployeeController = {
  createEmployee,
  createUser,
  getAllEmployees,
  getSingleEmployee,
  getSingleUserEmployee,
  updateEmployee,
  updateAdditionalLocation,
};
