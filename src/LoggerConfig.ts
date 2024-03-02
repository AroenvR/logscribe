/**
 * The drivers supported by the application for logging.
 */
type TLogDrivers = 'winston';

/**
 * The logging levels supported by the application.  
 * These levels are used to determine the verbosity of the logs.
 */
export type TLogLevels = 'verbose' | 'debug' | 'info' | 'log' | 'warn' | 'error' | 'critical';

interface ILoggerHTTPConfig {
  host: string;
  path: number;
  token: string;
}

/**
 * The configuration settings for the logger.
 * @property driver The driver used for logging.
 * @property level The logging level.
 * @property console A boolean indicating whether to log to the console.
 * @property file A boolean indicating whether to log to a file.
 * @property filePath The file path for the log file.
 */
export interface ILoggerConfig {
  appName: string;
  driver: TLogDrivers;
  level: TLogLevels;
  console: boolean;
  file: boolean;
  filePath?: string;
  // http: boolean;
  // httpConfig?: ILoggerHTTPConfig; // To properly implement, remove the question mark and get started.
}

/**
 * Class responsible for loading and providing logger configuration settings.
 */
export class LoggerConfig {

  /**
   * Loads the logging configuration from environment variables or configuration files.
   * Falls back to default settings if specific configurations are not found.
   * @returns An object containing logging configuration.
   */
  static loadConfiguration(): ILoggerConfig {
    const defaultConfig: ILoggerConfig = {
      appName: 'app',
      driver: 'winston',
      level: 'info',
      console: false,
      file: true,
      filePath: './logs',
      // http: false,
    };

    return defaultConfig;
  }
}
