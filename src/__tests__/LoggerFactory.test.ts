import path from 'path';
import { ILogger } from '../ILogger';
import { LoggerFactory } from '../LoggerFactory';
import { defaultConfig, fallbackConfig } from './testingConfigs';
import { TLoggerOptions } from '../LoggerConfigurator';

describe('LoggerFactory', () => {
    let logger: ILogger;

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    it("Gets a logger with default configuration if no settings are found", () => {
        logger = LoggerFactory.getLogger();

        expect(logger).toBeDefined();
        expect(logger.config).toEqual(fallbackConfig);
    });

    // ------------------------------

    it('Creates a logger with the given configuration environment variable', () => {
        process.env.LOGSCRIBE_CONFIG = path.join(__dirname, 'loggerConfig.json');
        logger = LoggerFactory.initialize();

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Creates a logger with the given configuration file path', () => {
        const configPath = path.join(__dirname, 'loggerConfig.json');
        const config: TLoggerOptions = { loader: "file", path: configPath }
        logger = LoggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Creates a logger with the given configuration object', () => {
        let config: TLoggerOptions = { loader: "object", config: defaultConfig }
        logger = LoggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Returns a singleton logger instance', () => {
        const loggerOne = LoggerFactory.getLogger();
        const loggerTwo = LoggerFactory.getLogger();

        expect(loggerOne).toBeDefined();
        expect(loggerTwo).toBeDefined();
        expect(loggerOne).toBe(loggerTwo);
    });

});

