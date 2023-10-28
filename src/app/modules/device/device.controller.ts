import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DeviceService } from './device.service';
import { ITerminal, ITerminalUser, IUserInfo } from './device.interface';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createDeviceEmployee = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await DeviceService.createDeviceEmployee(data);

  sendResponse<Partial<IUserInfo>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Created successfully',
    data: result,
  });
});
const getDeviceEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await DeviceService.getDeviceEmployee();

  sendResponse<IUserInfo[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users Info retrieved successfully',
    data: result,
  });
});

const getDeviceEmployeeById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await DeviceService.getDeviceEmployeeById(id);

    sendResponse<Partial<IUserInfo>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Info retrieved successfully',
      data: result,
    });
  }
);

const updateDeviceEmployee = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result = await DeviceService.updateDeviceEmployee(id, data);

  sendResponse<{ msg: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Info Updated successfully',
    data: result,
  });
});

const deleteDeviceEmployee = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DeviceService.deleteDeviceEmployee(id);

  sendResponse<{ msg: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Info Deleted successfully',
    data: result,
  });
});

const getAllTerminals = catchAsync(async (req: Request, res: Response) => {
  const result = await DeviceService.getAllTerminals();

  sendResponse<ITerminal[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terminals Retrieved successfully',
    data: result,
  });
});

const getAllTerminalsById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DeviceService.getAllTerminalsById(id);

  sendResponse<ITerminal[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terminals Retrieved successfully',
    data: result,
  });
});

const assignTerminalToUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await DeviceService.assignTerminalToUser(data);

  sendResponse<ITerminalUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terminal Assigned successfully',
    data: result,
  });
});

const removeUserFromTerminal = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const result = await DeviceService.removeUserFromTerminal(
      id,
      data?.TerminalID
    );

    sendResponse<{ msg: string }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Terminal Removed successfully',
      data: result,
    });
  }
);

export const DeviceController = {
  createDeviceEmployee,
  getDeviceEmployee,
  getDeviceEmployeeById,
  updateDeviceEmployee,
  deleteDeviceEmployee,
  getAllTerminals,
  getAllTerminalsById,
  assignTerminalToUser,
  removeUserFromTerminal,
};
