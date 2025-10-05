const config = {
  user: 'sa',
  password: 'Testbat1#',
  server: '192.168.1.24',
  database: 'tbzAttendanceDB',
  options: {
    encrypt: false,
    trustedconnection: true,
    enableArithAbort: true,
    instancename: 'MSSQLSERVER',
  },

  port: 1433,
};

export const DBConfig = {
  config,
};
