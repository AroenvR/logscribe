import { ILogger } from './ILogger';
import { WinstonLogger } from './strategies/WinstonLogger';
import { ILoggerConfig, LoggerConfig } from './LoggerConfig';

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
            const config = LoggerConfig.loadConfiguration();
            this.instance = this.createInstance(config);
        }

        return LoggerFactory.instance;
    }

    /**
     * Creates a logger instance based on the provided configuration settings.
     * @param config The configuration settings for the logger.
     * @returns {ILogger} A logger instance.
     */
    private static createInstance(config: ILoggerConfig): ILogger {
        switch (config.driver) {
            case 'winston':
                return new WinstonLogger(config);

            default:
                throw new Error(`LoggerFactory: Unsupported logger driver: ${config.driver}`);
        }
    }
}