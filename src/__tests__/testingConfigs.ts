import { ILoggerConfig } from "../LoggerConfigurator"

/**
 * The fallback configuration for the logger.
 */
export const fallbackConfig: ILoggerConfig = {
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
}

/**
 * The default configuration for testing the logger.
 */
export const defaultConfig: ILoggerConfig = {
    appName: 'JestTest',
    driver: 'winston',
    level: 'verbose',
    console: true,
    file: {
        enabled: false,
    },
    http: {
        enabled: false
    }
}