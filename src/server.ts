import { Server } from 'http';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
// import sql from 'mssql';
// import { DBConfig } from './config/dbConfig';

// export const pool = new sql.ConnectionPool(DBConfig.config);

async function main() {
  // pool
  //   .connect()
  //   .then(() => {
  //     logger.info('Connected to SQL Server');
  //   })
  //   .catch(err => {
  //     errorLogger.error('Error connecting to SQL Server: ', err);
  //   });

  const server: Server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    errorLogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

main();
