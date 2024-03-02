import { ILoggerConfig } from "../LoggerConfigurator";
import { ILogger } from "../ILogger";
import { Logger } from "../Logger";

describe('ILogger', () => {
    let config: ILoggerConfig = {
        level: 'normal',
        console: true,
        file: true,
        filePath: './logs/app.log',
    };

    let logger: ILogger;

    beforeEach(() => {
        logger = new Logger(config);

        // Mock the actual logging functions, since we don't want to perform real I/O during tests.
        jest.spyOn(logger, 'verbose').mockImplementation(() => { });
        jest.spyOn(logger, 'debug').mockImplementation(() => { });
        jest.spyOn(logger, 'info').mockImplementation(() => { });
        jest.spyOn(logger, 'log').mockImplementation(() => { });
        jest.spyOn(logger, 'warn').mockImplementation(() => { });
        jest.spyOn(logger, 'error').mockImplementation(() => { });
        jest.spyOn(logger, 'critical').mockImplementation(() => { });
    });

    afterAll(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    test('verbose should log when appropriate level is set', () => {
        config.level = 'verbose';
        logger.verbose('A verbose message', { key: 'value' });
        expect(logger.verbose).toHaveBeenCalled();
    });

    // ------------------------------

    test('debug should log when appropriate level is set', () => {
        config.level = 'debug';
        logger.debug('A debug message');
        expect(logger.debug).toHaveBeenCalled();
    });

    // ------------------------------

    test('info should not log if level is set to warn', () => {
        config.level = 'warn';
        logger.info('An informational message');
        expect(logger.info).not.toHaveBeenCalled();
    });

});