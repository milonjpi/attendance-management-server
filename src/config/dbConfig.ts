const config = {
  user: 'sa',
  password: 'Testbat1#',
  server: '172.25.8.200',
  database: 'NitgenAccessManager',
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
