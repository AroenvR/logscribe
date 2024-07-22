import fs from 'fs-extra';
import { ILoggerConfig, TLoggerOptions } from '../ILoggerConfiguration';
import { ILoggerConfigurator } from './ILoggerConfigurator';

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
      enableCorrelation: false,
      level: 'critical',
      console: false,
      file: {
        enabled: false,
      },
      http: {
        enabled: false,
      },
      useWhitelist: false,
      prefixWhitelist: [],
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
