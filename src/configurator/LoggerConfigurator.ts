import fs from 'fs-extra';
import { AbstractAdapter } from "../adapters/AbstractAdapter";

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
 * The options for loading the logger configuration settings.  
 * @property loader The loader to use for loading the configuration settings.  
 * @property path The path to the configuration file.  
 * @property config The configuration settings to load.
 * @devnote  
 * If the loader is set to 'file', the path property is required.  
 * If the loader is set to 'object', the config property is required.  
 */
export type TLoggerOptions = {
  loader: 'file';
  path: string;
} | {
  loader: 'object';
  config: ILoggerConfig;
}

/**
 * Interface for the logger configurator.
 * @property opts The options for the logger configurator.
 * @property config The configuration settings for the logger.
 */
export interface ILoggerConfigurator {
  opts: TLoggerOptions | null;
  config: ILoggerConfig | null;

  /**
   * Loads the configuration settings.
   * @returns The configuration settings for the logger.
   * @devnote  
   * Will check the environment variable LOGSCRIBE_CONFIG for a configuration file first.  
   * If the environment variable is not set, it will load the configuration based on the provided options.  
   * If no options are provided, it will return the default configuration.
   */
  loadConfiguration(fallbackConfig?: ILoggerConfig): ILoggerConfig;
}

/**
 * Class responsible for loading and providing logger configuration settings.
 * @implements The {@link ILoggerConfigurator} interface.
 */
export class LoggerConfigurator implements ILoggerConfigurator {
  private readonly name = 'LoggerConfigurator';
  private _opts: TLoggerOptions | null = null;
  private _config: ILoggerConfig | null = null;

  constructor(opts?: TLoggerOptions) {
    if (opts) this._opts = opts;
  }

  /**
   * 
   */
  public loadConfiguration(fallbackConfig?: ILoggerConfig): ILoggerConfig {
    // Set a fallback configuration failsafe.
    if (!fallbackConfig) fallbackConfig = {
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

    // If the environment variable LOGSCRIBE_CONFIG is set, load the configuration from the specified file.
    if (process.env.LOGSCRIBE_CONFIG) {
      this._config = JSON.parse(fs.readFileSync(process.env.LOGSCRIBE_CONFIG, 'utf8'));
      return this.config;
    }

    // If no options are provided, return the default configuration.
    if (!this.opts || !this.opts.loader) {
      this.config = fallbackConfig;
      return this.config;
    }

    // Load the configuration based on the provided options.
    switch (this.opts.loader) {
      case 'file':
        this._config = JSON.parse(fs.readFileSync(this.opts.path, 'utf8'));
        break;

      case 'object':
        this._config = this.opts.config;
        break;

      default:
        this.config = fallbackConfig;
        break;
    }

    return this.config;
  };

  /* Getters & Setters */

  public get opts(): TLoggerOptions | null {
    return this._opts;
  }

  public get config(): ILoggerConfig {
    if (!this._config) throw new Error(`${this.name}: Configuration has not been loaded.`);
    return this._config;
  }

  private set config(config: ILoggerConfig) {
    this._config = config;
  }
}
