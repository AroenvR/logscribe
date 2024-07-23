import { ILoggerConfig } from "./ILoggerConfiguration";

/**
 * Fallback configuration for the logger.
 */
export const defaultConfiguration: ILoggerConfig = {
    appName: 'UNKNOWN-LOGGER_SET_TO_DEFAULT_CONFIG',
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