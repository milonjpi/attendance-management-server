import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BulkService } from './bulk.service';
import { Request, Response } from 'express';

// bulk create
const bulkCreate = catchAsync(async (req: Request, res: Response) => {
  const result = await BulkService.bulkCreate();

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Created Successfully',
    data: result,
  });
});

export const BulkController = {
  bulkCreate,
};
