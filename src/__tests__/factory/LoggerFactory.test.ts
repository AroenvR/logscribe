import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { ILogger } from '../../ILogger';
import { LoggerConfigurator } from '../../configurator/LoggerConfigurator';
import { ILoggerFactory } from '../../factory/ILoggerFactory';
import { LoggerFactory } from '../../factory/LoggerFactory';
import { defaultConfig, fileConfig, testLogDir, testLogFilename } from '../config_files/testingConfigs';
import { CorrelationManager } from '../../correlation/CorrelationManager';
import { ILoggerConfig } from '../../ILoggerConfiguration';

describe('LoggerFactory', () => {
	let logger: ILogger;
	let loggerFactory: ILoggerFactory;

	beforeEach(() => {
		loggerFactory = new LoggerFactory();
	});

	// ------------------------------

	test('Throws an error if no settings are found', () => {
		expect(() => loggerFactory.getLogger()).toThrowError('LoggerFactory: Logger instance not initialized.');
	});

	// ------------------------------

	test('Creates a logger with the given configuration environment variable', () => {
		process.env.LOGSCRIBE_CONFIG = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
		const config = new LoggerConfigurator().loadConfiguration();

		logger = loggerFactory.initialize(config);
		expect(logger.config).toEqual(defaultConfig);
	});

	// ------------------------------

	test('Creates a logger with the given configuration file path', () => {
		const configPath = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
		const config = new LoggerConfigurator({ loader: 'file', path: configPath }).loadConfiguration();

		logger = loggerFactory.initialize(config);

		expect(logger.config).toEqual(defaultConfig);
	});

	// ------------------------------

	test('Creates a logger with the given configuration object', () => {
		const config = new LoggerConfigurator({ loader: 'object', config: defaultConfig }).loadConfiguration();
		logger = loggerFactory.initialize(config);

		expect(logger.config).toEqual(defaultConfig);
	});

	// ------------------------------

	test('Can return a singleton logger instance', () => {
		const config = new LoggerConfigurator({ loader: 'object', config: defaultConfig }).loadConfiguration();
		logger = loggerFactory.initialize(config);

		const loggerOne = loggerFactory.getLogger();
		const loggerTwo = loggerFactory.getLogger();

		expect(loggerOne).toBeDefined();
		expect(loggerTwo).toBeDefined();
		expect(loggerOne).toBe(loggerTwo);
	});

	// ------------------------------

	test('Can return a prefixed logger instance', () => {
		const config = new LoggerConfigurator({ loader: 'object', config: defaultConfig }).loadConfiguration();
		loggerFactory.initialize(config);

		const logger = loggerFactory.getPrefixedLogger('TEST');
		expect(logger).toBeDefined();
	});

	// ------------------------------

	test('Can create a prefixed logged which behaves as expected', async () => {
		const config = new LoggerConfigurator({ loader: 'object', config: fileConfig }).loadConfiguration();
		const correlationManager = new CorrelationManager();
		loggerFactory.initialize(config, correlationManager);

		const logger = loggerFactory.getPrefixedLogger('TEST');

		const correlationId = uuidv4();
		correlationManager.runWithCorrelationId(correlationId, () => {
			logger.verbose('This is a verbose message.');
			logger.debug('This is a debug message.');
			logger.info('This is an info message.');
			logger.log('This is a log message.');
			logger.warn('This is a warning message.');
			logger.error('This is an error message.');
			logger.critical('This is a critical message.');
		});

		const logFilePath = path.join(testLogDir, testLogFilename);
		expect(await fs.exists(testLogDir)).toBe(true);
		expect(await fs.exists(logFilePath)).toBe(true);

		const logContent = await fs.readFile(logFilePath, 'utf-8');

		expect(logContent).toContain(`FileTest ${correlationId} VERBOSE - TEST: This is a verbose message.`);
		expect(logContent).toContain(`FileTest ${correlationId} DEBUG - TEST: This is a debug message.`);
		expect(logContent).toContain(`FileTest ${correlationId} INFO - TEST: This is an info message.`);
		expect(logContent).toContain(`FileTest ${correlationId} LOG - TEST: This is a log message.`);
		expect(logContent).toContain(`FileTest ${correlationId} WARN - TEST: This is a warning message.`);
		expect(logContent).toContain(`FileTest ${correlationId} ERROR - TEST: This is an error message.`);
		expect(logContent).toContain(`FileTest ${correlationId} CRITICAL - TEST: This is a critical message.`);
	});

	// ------------------------------

	test('Throw an error when an unsupported logging driver is given', async () => {
		const loggerConfig: ILoggerConfig = {
			appName: 'ThrowingTest',
			// @ts-ignore => Gotta ignore since the driver is typed.
			driver: 'foobar',
			enableCorrelation: false,
			level: 'verbose',
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
		const config = new LoggerConfigurator({ loader: 'object', config: loggerConfig }).loadConfiguration();

		expect(() => loggerFactory.initialize(config)).toThrow(`LoggerFactory: Unsupported logger driver: foobar`);
	});
});
