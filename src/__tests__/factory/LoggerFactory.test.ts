import path from "path";
import { ILogger } from "../../ILogger";
import { LoggerConfigurator } from "../../configurator/LoggerConfigurator";
import { ILoggerFactory } from "../../factory/ILoggerFactory";
import { LoggerFactory } from "../../factory/LoggerFactory";
import { defaultConfig } from "../config_files/testingConfigs";

describe("LoggerFactory", () => {
    let logger: ILogger;
    let loggerFactory: ILoggerFactory;

    beforeEach(() => {
        loggerFactory = new LoggerFactory();
    })

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    it("Throws an error if no settings are found", () => {
        expect(() => loggerFactory.getLogger()).toThrowError('LoggerFactory: Logger instance not initialized.');
    });

    // ------------------------------

    it('Creates a logger with the given configuration environment variable', () => {
        process.env.LOGSCRIBE_CONFIG = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
        const config = new LoggerConfigurator().loadConfiguration();

        logger = loggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Creates a logger with the given configuration file path', () => {
        const configPath = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
        const config = new LoggerConfigurator({ loader: "file", path: configPath }).loadConfiguration();

        logger = loggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Creates a logger with the given configuration object', () => {
        const config = new LoggerConfigurator({ loader: "object", config: defaultConfig }).loadConfiguration();
        logger = loggerFactory.initialize(config);

        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Can return a singleton logger instance', () => {
        const config = new LoggerConfigurator({ loader: "object", config: defaultConfig }).loadConfiguration();
        logger = loggerFactory.initialize(config);

        const loggerOne = loggerFactory.getLogger();
        const loggerTwo = loggerFactory.getLogger();

        expect(loggerOne).toBeDefined();
        expect(loggerTwo).toBeDefined();
        expect(loggerOne).toBe(loggerTwo);
    });

    // ------------------------------

    it("Can return a prefixed logger instance", () => {
        const config = new LoggerConfigurator({ loader: "object", config: defaultConfig }).loadConfiguration();
        loggerFactory.initialize(config);

        const logger = loggerFactory.getPrefixedLogger("TEST");
        expect(logger).toBeDefined();
    });
});