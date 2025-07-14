import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Bill, BillDetail, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IBillFilters, IBillResponse } from './bill.interface';
import { billSearchableFields } from './bill.constant';

// create
const insertIntoDB = async (
  data: Bill,
  billDetails: BillDetail[]
): Promise<Bill | null> => {
  const result = await prisma.bill.create({
    data: { ...data, billDetails: { create: billDetails } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBillFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBillResponse>> => {
  const {
    searchTerm,
    locationId,
    officeId,
    startDate,
    endDate,
    status,
    isService,
  } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: billSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }
  if (locationId) {
    andConditions.push({
      locationId: Number(locationId),
    });
  }
  if (officeId) {
    andConditions.push({
      officeId,
    });
  }

  if (isService) {
    andConditions.push({
      isService: isService === 'true' ? true : false,
    });
  }

  if (startDate) {
    andConditions.push({
      date: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      date: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  const whereConditions: Prisma.BillWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.bill.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      location: {
        include: {
          area: true,
        },
      },
      employee: {
        include: {
          designation: true,
          department: true,
        },
      },
      billDetails: {
        include: {
          item: true,
          shop: true,
          uom: true,
        },
      },
    },
  });

  const total = await prisma.bill.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalCount = await prisma.bill.aggregate({
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: {
      data: result,
      sum: totalCount,
    },
  };
};

// get single
const getSingle = async (id: number): Promise<Bill | null> => {
  const result = await prisma.bill.findFirst({
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
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: number,
  data: Partial<Bill>,
  billDetails: BillDetail[]
): Promise<Bill | null> => {
  // check is exist
  const isExist = await prisma.bill.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bill Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.bill.update({
      where: { id },
      data: { billDetails: { deleteMany: {} } },
    });

    return await trans.bill.update({
      where: { id },
      data: { ...data, billDetails: { create: billDetails } },
    });
  });

  return result;
};

// approve
const approveSingle = async (id: number): Promise<Bill | null> => {
  // check is exist
  const isExist = await prisma.bill.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bill Not Found');
  }

  if (isExist.status === 'Approved') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  if (isExist.status === 'Rejected') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Rejected');
  }

  const result = await prisma.bill.update({
    where: { id },
    data: { status: 'Approved' },
  });

  return result;
};

// Reject
const rejectSingle = async (id: number): Promise<Bill | null> => {
  // check is exist
  const isExist = await prisma.bill.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bill Not Found');
  }

  if (isExist.status === 'Approved') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Approved');
  }

  if (isExist.status === 'Rejected') {
    throw new ApiError(httpStatus.BAD_REQUEST, '!!Forbidden, Already Rejected');
  }

  const result = await prisma.bill.update({
    where: { id },
    data: { status: 'Rejected' },
  });

  return result;
};

// delete
const deleteFromDB = async (id: number): Promise<Bill | null> => {
  // check is exist
  const isExist = await prisma.bill.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bill Not Found');
  }

  if (isExist.status !== 'Pending') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You Cant Delete after Approved/Rejected'
    );
  }

  const result = await prisma.$transaction(async trans => {
    await trans.bill.update({
      where: { id },
      data: { billDetails: { deleteMany: {} } },
    });

    return await trans.bill.delete({ where: { id } });
  });

  return result;
};

export const BillService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  approveSingle,
  rejectSingle,
  deleteFromDB,
};
