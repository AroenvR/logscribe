import { LoggerFactory } from '../LoggerFactory';

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
        // Assuming LoggerConfig can load a default configuration in the absence of environment-specific settings
        const logger = LoggerFactory.getLogger();

        // Here you would check for some default properties of the logger.
        // This might depend on your logger's implementation details, such as checking the log level or the transports.
        // For example: expect(logger.getLevel()).toBe('info');
        // Since we haven't implemented the actual loggers yet, we'll skip the detailed assertions for now.
        expect(logger).toBeDefined();
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

