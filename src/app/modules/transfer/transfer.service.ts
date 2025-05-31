import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Transfer, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { ITransferFilters } from './transfer.interface';
import { transferSearchableFields } from './transfer.constant';

// create
const insertIntoDB = async (data: Transfer): Promise<Transfer | null> => {
  const result = await prisma.transfer.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Transfer');
  }

  return result;
};

// get all
const getAll = async (
  filters: ITransferFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Transfer[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: transferSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]:
          value === 'true' ? true : value === 'false' ? false : Number(value),
      })),
    });
  }

  const whereConditions: Prisma.TransferWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.transfer.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      employee: {
        include: {
          designation: true,
          department: true,
          location: {
            include: {
              area: true,
            },
          },
        },
      },
      fromLocation: { include: { area: true } },
      toLocation: { include: { area: true } },
    },
  });

  const total = await prisma.transfer.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// get single
const getSingle = async (id: number): Promise<Transfer | null> => {
  const result = await prisma.transfer.findFirst({
    where: {
      id,
    },
    include: {
      employee: {
        include: {
          designation: true,
          department: true,
          location: {
            include: {
              area: true,
            },
          },
        },
      },
      fromLocation: { include: { area: true } },
      toLocation: { include: { area: true } },
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<Transfer>
): Promise<Transfer | null> => {
  // check is exist
  const isExist = await prisma.transfer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer Not Found');
  }

  const result = await prisma.transfer.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// approve
const approveSingle = async (id: number): Promise<Transfer | null> => {
  // check is exist
  const isExist = await prisma.transfer.findFirst({
    where: {
      id,
    },
    include: {
      employee: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer Not Found');
  }

  if (isExist.employee?.locationId !== isExist.fromLocationId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      '!!Forbidden, Miss Match Location'
    );
  }

  if (isExist.isApproved) {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.employee.update({
      where: { officeId: isExist.officeId },
      data: { locationId: isExist.toLocationId },
    });

    return await trans.transfer.update({
      where: { id },
      data: { isApproved: true },
    });
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<Transfer | null> => {
  // check is exist
  const isExist = await prisma.transfer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer Not Found');
  }

  if (isExist.isApproved) {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  const result = await prisma.transfer.delete({
    where: {
      id,
    },
  });

  return result;
};

export const TransferService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  approveSingle,
  deleteFromDB,
};
