// import httpStatus from 'http-status';
// import ApiError from '../../../errors/ApiError';
// import prisma from '../../../shared/prisma';
// import { pool } from '../../../server';
// import moment from 'moment';

// bulk create
const bulkCreate = async (): Promise<string> => {
  // const result = await pool.request().query(`SELECT * FROM monthSalaryDetails`);

  // await prisma.monthSalaryDetail.createMany({
  //   data: result.recordset,
  // });

  // await prisma.attendance.createMany({
  //   data: result.recordset.map(el => ({
  //     ...el,
  //     date: moment(el.date).subtract(6, 'hours'),
  //     inTime: el.inTime ? moment(el.inTime).subtract(6, 'hours') : null,
  //     outTime: el.outTime ? moment(el.outTime).subtract(6, 'hours') : null,
  //   })),
  // });

  return 'success';
};

export const BulkService = {
  bulkCreate,
};
