import { LoggerFactory } from "./LoggerFactory";
import { AbstractAdapter } from "./adapters/AbstractAdapter";

/**
 * The drivers supported by the application for logging.
 * @devnote When adding a new driver, ensure to do the following:  
 * 1. Add the driver to the {@link TLogDrivers} type.  
 * 2. Add the driver to the {@link LoggerFactory.createInstance} method.
 * 3. Create a new {@link AbstractAdapter} for the driver.
 */
type TLogDrivers = 'winston';

/**
 * The configuration settings for the file logger.
 * @property enabled A boolean indicating whether the file logger is enabled.
 * @property path The path for the file logger.
 * @property name The name for the file logger.
 * @devnote If the file logger is enabled, the path and name properties are required.
 */
type TLoggerFileConfig = {
  enabled: false;
} | {
  enabled: true;
  path?: string;
  name?: string;
};

/**
 * The configuration settings for the HTTP logger.
 * @property enabled A boolean indicating whether the HTTP logger is enabled.
 * @property host The host for the HTTP logger.
 * @property path The path for the HTTP logger.
 * @property token The token for the HTTP logger.
 * @devnote If the HTTP logger is enabled, the host, path, and token properties are required.
 */
type TLoggerHTTPConfig = {
  enabled: false
} | {
  enabled: true;
  host: string;
  path: number;
  token: string;
};

/**
 * The logging levels supported by the application.  
 * These levels are used to determine the verbosity of the logs.
 */
export type TLogLevels = 'verbose' | 'debug' | 'info' | 'log' | 'warn' | 'error' | 'critical';

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
  file: TLoggerFileConfig;
  http: TLoggerHTTPConfig;
}

/**
 * Class responsible for loading and providing logger configuration settings.
 */
export class LoggerConfigurator {

  /**
   * Loads the logging configuration from environment variables or configuration files.
   * Falls back to default settings if specific configurations are not found.
   * @returns An object containing logging configuration.
   */
  static loadConfiguration(): ILoggerConfig {
    const defaultConfig: ILoggerConfig = {
      appName: 'UNKNOWN-SET_TO_DEFAULT_CONFIG',
      driver: 'winston',
      level: 'critical',
      console: false,
      file: {
        enabled: false,
      },
      http: {
        enabled: false,
      }
    };

    return defaultConfig;
  }
}
