import { ILoggerConfig } from "../LoggerConfig";

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