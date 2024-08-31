import { ILoggerConfig } from '../../ILoggerConfiguration';

/**
 * The fallback configuration for the logger.
 */
export const fallbackConfig: ILoggerConfig = {
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

/**
 * The default configuration for testing the logger.
 */
export const defaultConfig: ILoggerConfig = {
	appName: 'DefaultConfigTest',
	driver: 'winston',
	enableCorrelation: false,
	level: 'verbose',
	console: true,
	file: {
		enabled: false,
	},
	http: {
		enabled: false,
	},
	useWhitelist: false,
	prefixWhitelist: [],
};

export const testLogDir = './test_logs';
export const testLogFilename = 'testing.log';
/**
 * The default configuration for testing the logger with a file.
 */
export const fileConfig: ILoggerConfig = {
	appName: 'FileTest',
	driver: 'winston',
	enableCorrelation: true,
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
	useWhitelist: true,
	prefixWhitelist: ['TEST', 'console.log'],
};

/**
 * The default configuration for testing the logger with the console.
 */
export const consoleConfig: ILoggerConfig = {
	appName: 'ConsoleTest',
	driver: 'winston',
	enableCorrelation: false,
	level: 'verbose',
	console: true,
	file: {
		enabled: false,
	},
	http: {
		enabled: false,
	},
	useWhitelist: false,
	prefixWhitelist: [],
};
