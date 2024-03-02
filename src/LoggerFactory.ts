import { ILogger } from './ILogger';
import { ILoggerConfig, LoggerConfigurator, TLoggerOptions } from './LoggerConfigurator';
import { WinstonAdapter } from './adapters/WinstonAdapter';

/**
 * Factory class for creating logger instances.
 * Utilizes the LoggerConfig for determining the appropriate logger settings based on the environment.
 */
export class LoggerFactory {
    private static instance: ILogger;

    /**
     * Returns a singleton logger instance.
     * @returns {ILogger} A logger instance.
     */
    public static getLogger(): ILogger {
        if (!LoggerFactory.instance) {
            this.instance = this.initialize();
        }

        return LoggerFactory.instance;
    }

    /**
     * Initializes the logger instance based on the provided configuration settings.
     * @param opts The configuration settings for the logger.
     * @returns {ILogger} A logger instance.
     */
    public static initialize(opts?: TLoggerOptions): ILogger {
        const configurator = new LoggerConfigurator(opts);
        const configuration = configurator.loadConfiguration();

        this.instance = this.createAdapter(configuration);
        return this.instance;
    }

    /**
     * Creates a logger instance based on the provided configuration settings.
     * @param config The configuration settings for the logger.
     * @returns {ILogger} A logger instance.
     */
    private static createAdapter(config: ILoggerConfig): ILogger {
        switch (config.driver) {
            case 'winston':
                return new WinstonAdapter(config);

            default:
                throw new Error(`LoggerFactory: Unsupported logger driver: ${config.driver}`);
        }
    }
}