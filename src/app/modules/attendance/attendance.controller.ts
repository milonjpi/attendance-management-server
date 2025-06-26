import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Attendance } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { AttendanceService } from './attendance.service';
import {
  attendanceFilterableFields,
  singleAttendanceFilterableFields,
} from './attendance.constant';

// create Attendance
const createAttendance = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AttendanceService.createAttendance(data);

  sendResponse<Attendance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Attendance Added Successfully',
    data: result,
  });
});

// create geo Attendance
const createGeoAttendance = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AttendanceService.createGeoAttendance(data);

  sendResponse<Attendance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Attendance Added Successfully',
    data: result,
  });
});

// create geo leave
const createGeoLeave = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AttendanceService.createGeoLeave(data);

  sendResponse<Attendance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Leave Successfully',
    data: result,
  });
});

// get all Attendance
const getAllAttendances = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, attendanceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AttendanceService.getAllAttendances(
    filters,
    paginationOptions
  );

  sendResponse<Attendance[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendances retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single Attendance
const getSingleAttendances = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, singleAttendanceFilterableFields);

  const result = await AttendanceService.getSingleAttendances(filters);

  sendResponse<Attendance | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendances retrieved successfully',
    data: result,
  });
});

// delete attendance
const deleteAttendance = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await AttendanceService.deleteAttendance(id);

  sendResponse<Attendance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance Deleted successfully',
    data: result,
  });
});

export const AttendanceController = {
  createAttendance,
  createGeoAttendance,
  createGeoLeave,
  getAllAttendances,
  getSingleAttendances,
  deleteAttendance,
};
