import path from "path";
import fs from "fs-extra";
import { v4 as uuidv4 } from 'uuid';
import { LoggerConfigurator } from "../configurator/LoggerConfigurator";
import { CorrelationManager } from "../correlation/CorrelationManager";
import { ICorrelationManager } from "../correlation/ICorrelationManager";
import { ILogger } from "../ILogger";
import { TLoggerOptions } from "../ILoggerConfiguration";
import { ILoggerConfigurator } from "../configurator/ILoggerConfigurator";
import { StaticLoggerFactory } from "../factory/StaticLoggerFactory";

describe("Integration test for logging", () => {
    const logDir = "./test_logs";
    const logFile = "Logging.log";

    const opts: TLoggerOptions = {
        loader: "object",
        config: {
            appName: 'IntegrationTest',
            driver: 'winston',
            enableCorrelation: true,
            level: 'verbose',
            console: false,
            file: {
                enabled: true,
                path: logDir,
                name: logFile
            },
            http: {
                enabled: false
            },
            useWhitelist: true,
            prefixWhitelist: ["TEST", "console.log"]
        }
    };

    let configurator: ILoggerConfigurator;
    let correlationManager: ICorrelationManager;

    let logger: ILogger;

    beforeEach(() => {
        configurator = new LoggerConfigurator(opts);
        correlationManager = new CorrelationManager();

        const config = configurator.loadConfiguration();
        StaticLoggerFactory.initialize(config, correlationManager);
        logger = StaticLoggerFactory.getLogger();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();

        const filePath = `${logDir}/${logFile}`;
        if (fs.existsSync(filePath)) fs.rmSync(filePath);
    });

    // ------------------------------

    test("Doesn't log a message without whitelisted prefix", async () => {
        const msg = "FOO: This is a debug message with a non-whitelisted prefix.";
        logger.debug(msg);

        const logFilePath = path.join(logDir, logFile);
        expect(await fs.exists(logDir)).toBe(true);
        expect(await fs.exists(logFilePath)).toBe(true);

        const logContent = await fs.readFile(logFilePath, "utf-8");
        expect(logContent).not.toContain(`IntegrationTest DEBUG - ${msg}`);
    });

    // ------------------------------

    test("Should log to a file with a timestamp, app name, correlation id, log level, message and metadata.", async () => {
        const firstCorrelationId = uuidv4();
        const secondCorrelationId = uuidv4();

        correlationManager.runWithCorrelationId(firstCorrelationId, () => {
            console.log("This is a verbose message.");

            logger.debug("TEST: This is a debug message with data:", { foo: "bar" });
            logger.info("TEST: This is an info message.");

            correlationManager.runWithCorrelationId(secondCorrelationId, () => {
                logger.log("TEST: This is a log message.");
                logger.warn("TEST: This is a warn message.");
            });

            logger.error("TEST: This is an error message.", new Error(`Foo: bar!`));
            logger.critical("TEST: This is a critical message.");
        });

        const logFilePath = path.join(logDir, logFile);
        expect(await fs.exists(logDir)).toBe(true);
        expect(await fs.exists(logFilePath)).toBe(true);

        const logContent = await fs.readFile(logFilePath, "utf-8");

        expect(logContent).toContain(`IntegrationTest ${firstCorrelationId} VERBOSE - console.log This is a verbose message.`);
        expect(logContent).toContain(`IntegrationTest ${firstCorrelationId} DEBUG - TEST: This is a debug message with data: {"foo":"bar"}`);
        expect(logContent).toContain(`IntegrationTest ${firstCorrelationId} INFO - TEST: This is an info message.`);

        expect(logContent).toContain(`IntegrationTest ${secondCorrelationId} LOG - TEST: This is a log message.`);
        expect(logContent).toContain(`IntegrationTest ${secondCorrelationId} WARN - TEST: This is a warn message.`);

        expect(logContent).toContain(`IntegrationTest ${firstCorrelationId} ERROR - TEST: This is an error message. Error: Foo: bar!`);
        expect(logContent).toContain(`IntegrationTest ${firstCorrelationId} CRITICAL - TEST: This is a critical message.`);
    });

    // ------------------------------

    test("Logs any message when whitelist isn't enabled", async () => {
        const newOpts: TLoggerOptions = {
            loader: "object",
            config: {
                appName: 'IntegrationTest',
                driver: 'winston',
                enableCorrelation: false,
                level: 'verbose',
                console: false,
                file: {
                    enabled: true,
                    path: logDir,
                    name: logFile
                },
                http: {
                    enabled: false
                },
                useWhitelist: false,
                prefixWhitelist: ["TEST", "console.log"]
            }
        };

        configurator = new LoggerConfigurator(newOpts);
        const config = configurator.loadConfiguration();

        StaticLoggerFactory.initialize(config, correlationManager);
        logger = StaticLoggerFactory.getLogger();

        const msg = "BAR: This is a debug message with a non-whitelisted prefix.";
        logger.debug(msg);

        const logFilePath = path.join(logDir, logFile);
        expect(await fs.exists(logDir)).toBe(true);
        expect(await fs.exists(logFilePath)).toBe(true);

        const logContent = await fs.readFile(logFilePath, "utf-8");
        expect(logContent).toContain(`IntegrationTest DEBUG - ${msg}`);
    });
});