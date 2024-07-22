import path from 'path';
import { ILogger } from '../../ILogger';
import { StaticLoggerFactory } from '../../factory/StaticLoggerFactory';
import { defaultConfig } from '../config_files/testingConfigs';
import { LoggerConfigurator } from '../../configurator/LoggerConfigurator';

describe('LoggerFactory', () => {
    let logger: ILogger;

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    it("Throws an error if no settings are found", () => {
        expect(() => StaticLoggerFactory.getLogger()).toThrowError('LoggerFactory: Logger instance not initialized.');
    });

    // ------------------------------

    it('Creates a logger with the given configuration environment variable', () => {
        process.env.LOGSCRIBE_CONFIG = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
        let configurator = new LoggerConfigurator();

        const config = configurator.loadConfiguration();
        logger = StaticLoggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Creates a logger with the given configuration file path', () => {
        const configPath = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
        let configurator = new LoggerConfigurator({ loader: "file", path: configPath });

        const config = configurator.loadConfiguration();
        logger = StaticLoggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Creates a logger with the given configuration object', () => {
        let configurator = new LoggerConfigurator({ loader: "object", config: defaultConfig });

        const config = configurator.loadConfiguration();
        logger = StaticLoggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Can return a singleton logger instance', () => {
        const loggerOne = StaticLoggerFactory.getLogger();
        const loggerTwo = StaticLoggerFactory.getLogger();

        expect(loggerOne).toBeDefined();
        expect(loggerTwo).toBeDefined();
        expect(loggerOne).toBe(loggerTwo);
    });

    // ------------------------------

    it("Can return a prefixed logger instance", () => {
        const logger = StaticLoggerFactory.getPrefixedLogger("TEST");
        expect(logger).toBeDefined();
    });

});

