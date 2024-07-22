import { ILogger } from '../ILogger';
import { ILoggerConfig } from '../ILoggerConfiguration';
import { WinstonAdapter } from '../adapters/WinstonAdapter';
import { ICorrelationManager } from '../correlation/ICorrelationManager';

/**
 * Factory class for creating logger instances.
 */
export class StaticLoggerFactory {
    private static instance: ILogger;

    /**
     * 
     */
    public static getLogger(): ILogger {
        if (!StaticLoggerFactory.instance) throw new Error('LoggerFactory: Logger instance not initialized.');
        return StaticLoggerFactory.instance;
    }

    /**
     * 
     */
    public static initialize(config: ILoggerConfig, correlationManager?: ICorrelationManager): ILogger {
        this.instance = this.createAdapter(config, correlationManager);
        return this.instance;
    }

    /**
     * Creates a logger instance based on the provided configuration settings.
     * @param config The configuration settings for the logger.
     * @returns {ILogger} A logger instance.
     */
    private static createAdapter(config: ILoggerConfig, correlationManager?: ICorrelationManager): ILogger {
        switch (config.driver) {
            case 'winston':
                return new WinstonAdapter(config, correlationManager);

            default:
                throw new Error(`LoggerFactory: Unsupported logger driver: ${config.driver}`);
        }
    }
}