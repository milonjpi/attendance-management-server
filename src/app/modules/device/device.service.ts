import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { pool } from '../../../server';
import { ITerminal, ITerminalUser, IUserInfo } from './device.interface';
import sql from 'mssql';

// create employee info
const createDeviceEmployee = async (
  payload: Partial<IUserInfo>
): Promise<Partial<IUserInfo>> => {
  const isExist = await pool
    .request()
    .query(
      `SELECT ID, Name, RFID FROM NGAC_USERINFO WHERE ID = ${payload.ID} OR RFID = ${payload.RFID}`
    );

  if (isExist.recordset.length) {
    throw new ApiError(httpStatus.CONFLICT, 'This ID or RFID Already Added');
  }
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();

    const result = await transaction
      .request()
      .query(
        `INSERT INTO NGAC_USERINFO (ID, Name, Privilege, AuthType, expDate, Password, RFID) OUTPUT inserted.IndexKey, inserted.ID VALUES (${payload?.ID}, '${payload?.Name}', 2, 4, '9999-01-01 23:59:59.000', 'A1518BD6C5E87D23DC0146BE03FAEDBD', ${payload?.RFID} )`
      );

    const employeeIndex = result?.recordset[0];

    await transaction
      .request()
      .query(
        `INSERT INTO NGAC_USERSETTING (UserIDIndex, UserID, SecurityLevel, Gain, Brightness, Contrast, tzInfo, MsgCode, AuthTypeEx) VALUES (${employeeIndex?.IndexKey}, ${employeeIndex?.ID}, 0, 0, 0, 0, 0, 0, 0)`
      );

    await transaction.commit();
    return result.recordset[0];
  } catch (err) {
    await transaction.rollback();
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

// get all employees
const getDeviceEmployee = async (): Promise<IUserInfo[]> => {
  const result = await pool
    .request()
    .query(`SELECT IndexKey, ID, Name, RFID FROM NGAC_USERINFO`);

  return result.recordset;
};

// get employee by id
const getDeviceEmployeeById = async (
  ID: string
): Promise<Partial<IUserInfo>> => {
  const result = await pool
    .request()
    .query(
      `SELECT IndexKey, ID, Name, RFID FROM NGAC_USERINFO WHERE ID = ${ID}`
    );

  return result.recordset[0];
};

// update employee
const updateDeviceEmployee = async (
  ID: string,
  payload: Partial<IUserInfo>
): Promise<{ msg: string }> => {
  const isExist = await pool
    .request()
    .query(`SELECT ID, Name, RFID FROM NGAC_USERINFO WHERE ID = ${ID}`);

  if (isExist.recordset.length < 1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  await pool
    .request()
    .query(`UPDATE NGAC_USERINFO SET RFID = ${payload?.RFID} WHERE ID = ${ID}`);

  return { msg: 'Successfully Updated' };
};

// delete employee
const deleteDeviceEmployee = async (ID: string): Promise<{ msg: string }> => {
  const isExist = await pool
    .request()
    .query(`SELECT ID, Name, RFID FROM NGAC_USERINFO WHERE ID = ${ID}`);

  if (isExist.recordset.length < 1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  await pool.request().query(`DELETE FROM NGAC_USERINFO WHERE ID = ${ID}`);

  return { msg: 'Successfully Deleted' };
};

// get all terminals
const getAllTerminals = async (): Promise<ITerminal[]> => {
  const result = await pool
    .request()
    .query(`SELECT ID, Name FROM NGAC_TERMINAL`);

  return result.recordset;
};

// get all terminals by id
const getAllTerminalsById = async (UserId: string): Promise<ITerminal[]> => {
  const result = await pool
    .request()
    .query(
      `SELECT u.UserIDIndex, u.TerminalID, u.UserID, u.Master, u.Saved, t.Name FROM NGAC_TERMINALUSER u LEFT JOIN NGAC_TERMINAL t ON u.TerminalID = t.ID WHERE UserID = ${UserId}`
    );

  return result.recordset;
};
//  assign terminal to user
const assignTerminalToUser = async (
  payload: ITerminalUser
): Promise<ITerminalUser> => {
  const isExistUser = await pool
    .request()
    .query(
      `SELECT IndexKey, ID, Name, RFID FROM NGAC_USERINFO WHERE IndexKey = ${payload.UserIDIndex}`
    );

  if (isExistUser.recordset.length < 1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const isExistTerminal = await pool
    .request()
    .query(
      `SELECT ID, Name FROM NGAC_TERMINAL WHERE ID = ${payload.TerminalID}`
    );

  if (isExistTerminal.recordset.length < 1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Terminal Not Found');
  }

  const isExistUserTerminal = await pool
    .request()
    .query(
      `SELECT UserIDIndex, TerminalID, UserID FROM NGAC_TERMINALUSER WHERE UserIDIndex = ${payload.UserIDIndex} AND TerminalID = ${payload.TerminalID}`
    );

  if (isExistUserTerminal.recordset.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already Added');
  }

  const result = await pool
    .request()
    .query(
      `INSERT INTO NGAC_TERMINALUSER (UserIDIndex, TerminalID, UserID, Master, Saved, tzCode, Reserved) OUTPUT inserted.TerminalID VALUES (${
        payload.UserIDIndex +
        ', ' +
        payload.TerminalID +
        ', ' +
        payload?.UserID +
        ', ' +
        2 +
        ', ' +
        0 +
        ', ' +
        0 +
        ', ' +
        0
      } )`
    );

  return result.recordset[0];
};

// delete user from terminal
const removeUserFromTerminal = async (
  UserId: string,
  TerminalID: string
): Promise<{ msg: string }> => {
  const isExist = await pool
    .request()
    .query(
      `SELECT * FROM NGAC_TERMINALUSER WHERE UserID = ${UserId} AND TerminalID = ${TerminalID}`
    );

  if (isExist.recordset.length < 1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Terminal Not Found');
  }

  await pool
    .request()
    .query(
      `DELETE FROM NGAC_TERMINALUSER WHERE UserID = ${UserId} AND TerminalID = ${TerminalID}`
    );

  return { msg: 'Successfully Removed' };
};

export const DeviceService = {
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
