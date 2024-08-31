import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { LoggerConfigurator } from '../configurator/LoggerConfigurator';
import { CorrelationManager } from '../correlation/CorrelationManager';
import { ICorrelationManager } from '../correlation/ICorrelationManager';
import { ILogger } from '../ILogger';
import { TLoggerLoadOptions } from '../ILoggerConfiguration';
import { fileConfig, testLogDir, testLogFilename } from './config_files/testingConfigs';
import { ILoggerFactory } from '../factory/ILoggerFactory';
import { LoggerFactory } from '../factory/LoggerFactory';

describe('Integration test for logging', () => {
	const opts: TLoggerLoadOptions = {
		loader: 'object',
		config: fileConfig,
	};

	let correlationManager: ICorrelationManager;

	let loggerFactory: ILoggerFactory;
	let logger: ILogger;

	beforeEach(() => {
		const config = new LoggerConfigurator(opts).loadConfiguration();
		correlationManager = new CorrelationManager();

		loggerFactory = new LoggerFactory();
		loggerFactory.initialize(config, correlationManager);

		logger = loggerFactory.getLogger();
	});

	// ------------------------------

	test("Doesn't log a message without whitelisted prefix", async () => {
		const msg = 'FOO: This is a debug message with a non-whitelisted prefix.';
		logger.debug(msg);

		const logFilePath = path.join(testLogDir, testLogFilename);
		expect(await fs.exists(testLogDir)).toBe(true);
		expect(await fs.exists(logFilePath)).toBe(true);

		const logContent = await fs.readFile(logFilePath, 'utf-8');
		expect(logContent).not.toContain(`IntegrationTest DEBUG - ${msg}`);
	});

	// ------------------------------

	test('Should log to a file with a timestamp, app name, correlation id, log level, message and metadata.', async () => {
		const firstCorrelationId = uuidv4();
		const secondCorrelationId = uuidv4();

		correlationManager.runWithCorrelationId(firstCorrelationId, () => {
			console.log('This is a verbose message.');

			logger.debug('TEST: This is a debug message with data:', { foo: 'bar' });
			logger.info('TEST: This is an info message.');

			correlationManager.runWithCorrelationId(secondCorrelationId, () => {
				logger.log('TEST: This is a log message.');
				logger.warn('TEST: This is a warn message.');
			});

			logger.error('TEST: This is an error message.', new Error(`Foo: bar!`));
			logger.critical('TEST: This is a critical message.');
		});

		const logFilePath = path.join(testLogDir, testLogFilename);
		expect(await fs.exists(testLogDir)).toBe(true);
		expect(await fs.exists(logFilePath)).toBe(true);

		const logContent = await fs.readFile(logFilePath, 'utf-8');

		expect(logContent).toContain(`FileTest ${firstCorrelationId} VERBOSE - console.log This is a verbose message.`);
		expect(logContent).toContain(`FileTest ${firstCorrelationId} DEBUG - TEST: This is a debug message with data: {"foo":"bar"}`);
		expect(logContent).toContain(`FileTest ${firstCorrelationId} INFO - TEST: This is an info message.`);

		expect(logContent).toContain(`FileTest ${secondCorrelationId} LOG - TEST: This is a log message.`);
		expect(logContent).toContain(`FileTest ${secondCorrelationId} WARN - TEST: This is a warn message.`);

		expect(logContent).toContain(`FileTest ${firstCorrelationId} ERROR - TEST: This is an error message. Error: Foo: bar!`);
		expect(logContent).toContain(`FileTest ${firstCorrelationId} CRITICAL - TEST: This is a critical message.`);
	});

	// ------------------------------

	test("Logs any message when whitelist isn't enabled", async () => {
		const newOpts: TLoggerLoadOptions = {
			loader: 'object',
			config: {
				appName: 'IntegrationTest',
				driver: 'winston',
				enableCorrelation: false,
				level: 'verbose',
				console: false,
				file: {
					enabled: true,
					path: testLogDir,
					name: testLogFilename,
				},
				http: {
					enabled: false,
				},
				useWhitelist: false,
				prefixWhitelist: ['TEST', 'console.log'],
			},
		};

		const config = new LoggerConfigurator(newOpts).loadConfiguration();

		loggerFactory.initialize(config, correlationManager);
		logger = loggerFactory.getLogger();

		const msg = 'BAR: This is a debug message with a non-whitelisted prefix.';
		logger.debug(msg);

		const logFilePath = path.join(testLogDir, testLogFilename);
		expect(await fs.exists(testLogDir)).toBe(true);
		expect(await fs.exists(logFilePath)).toBe(true);

		const logContent = await fs.readFile(logFilePath, 'utf-8');
		expect(logContent).toContain(`IntegrationTest DEBUG - ${msg}`);
	});
});
