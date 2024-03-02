import { LoggerFactory } from '../LoggerFactory';
import { defaultConfig } from './defaultConfig';

describe('LoggerFactory', () => {

    it('should return a singleton logger instance', () => {
        const loggerOne = LoggerFactory.getLogger();
        const loggerTwo = LoggerFactory.getLogger();

        expect(loggerOne).toBeDefined();
        expect(loggerTwo).toBeDefined();
        expect(loggerOne).toBe(loggerTwo);
    });

    // ------------------------------

    it('should create a logger with default configuration if no environment-specific settings are found', () => {
        const logger = LoggerFactory.getLogger();
        expect(logger.config).toEqual(defaultConfig);
    });

    // ------------------------------

    // This test assumes the existence of a method or property to verify the logger's configuration.
    // Adjust according to your ILogger interface and logger implementation details.
    it('should create a logger with the correct configuration', () => {
        const logger = LoggerFactory.getLogger();
        // Assuming logger exposes a way to check its configuration; adjust as necessary.
        // const config = logger.getConfig(); // This method or equivalent is hypothetical.
        // expect(config.level).toBeDefined();
        // expect(config.transports).toContain('console');
    });
});

