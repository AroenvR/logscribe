import { ILoggerConfigurator, LoggerConfigurator, TLoggerOptions } from "../configurator/LoggerConfigurator";
import { CorrelationManager } from "../correlation/CorrelationManager";
import { ICorrelationManager } from "../correlation/ICorrelationManager";
import { StaticLoggerFactory } from "../factory/LoggerFactory";
import { ILogger } from "../ILogger";

describe("Integration test for logging", () => {
    let configurator: ILoggerConfigurator;
    let correlationManager: ICorrelationManager;

    let logger: ILogger;

    beforeEach(() => {
        const opts: TLoggerOptions = {
            loader: "object",
            config: {
                appName: 'JestTest',
                driver: 'winston',
                enableCorrelation: true,
                level: 'verbose',
                console: true,
                file: {
                    enabled: false
                },
                http: {
                    enabled: false
                }
            }
        }
        configurator = new LoggerConfigurator(opts);
        correlationManager = new CorrelationManager();

        const config = configurator.loadConfiguration();
        StaticLoggerFactory.initialize(config, correlationManager);
        logger = StaticLoggerFactory.getLogger();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    test("Should log a verbose message", () => {
        const firstCorrelationId = "first-correlationId";
        const secondCorrelationId = "second-correlationId";

        correlationManager.runWithCorrelationId(firstCorrelationId, () => {
            logger.verbose("This is a verbose message.");
            logger.debug("This is a debug message.");

            correlationManager.runWithCorrelationId(secondCorrelationId, () => {
                logger.info("This is an info message.");
                logger.log("This is a log message.");
                logger.warn("This is a warn message.");
            });

            logger.error("This is an error message.");
            logger.critical("This is a critical message.");
        });

    });
});