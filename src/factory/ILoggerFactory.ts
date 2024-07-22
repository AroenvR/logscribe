import { ILoggerConfigurator } from "../configurator/LoggerConfigurator";
import { ICorrelationManager } from "../correlation/ICorrelationManager";
import { ILogger } from "../ILogger";

/**
 * Factory interface for creating logger instances.
 */
export interface ILoggerFactory {
    /**
     * Returns a singleton logger instance.
     * @returns {ILogger} A logger instance.
     */
    getLogger(): ILogger;

    /**
     * Initializes the logger instance based on the provided configuration settings.
     * @param configurator The configurator for loading the logger configuration settings.
     * @param correlationManager The correlation manager for managing correlation IDs.
     * @returns {ILogger} A logger instance.
     */
    initialize(configurator: ILoggerConfigurator, correlationManager: ICorrelationManager): ILogger;
}