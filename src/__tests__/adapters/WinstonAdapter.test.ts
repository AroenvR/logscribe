import { WinstonAdapter } from '../../adapters/WinstonAdapter';
import { ILoggerConfig } from '../../configurator/LoggerConfigurator';
import { CorrelationManager } from '../../correlation/CorrelationManager';
import { ICorrelationManager } from '../../correlation/ICorrelationManager';
import { ILogger } from '../../ILogger';

const defaultConfig: ILoggerConfig = {
    appName: 'JestTest',
    driver: 'winston',
    enableCorrelation: false,
    level: 'verbose',
    console: true,
    file: {
        enabled: false,
    },
    http: {
        enabled: false
    },
    processWhitelist: ["TEST", "console.log"]
}

describe('WinstonAdapter', () => {
    let correlationManager: ICorrelationManager;
    let adapter: ILogger;

    beforeEach(() => {
        adapter = new WinstonAdapter(defaultConfig);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    // It can log with a correlation ID

    // ------------------------------

    it('Handles verbose messages correctly', () => {
        const spy = jest.spyOn(adapter, 'verbose').mockImplementation();

        const message = 'TEST: Verbose test message';
        const metadata = { key: 'value' };

        adapter.verbose(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Overwrites the console correctly', () => {
        const spy = jest.spyOn(adapter, 'verbose').mockImplementation();

        const message = 'TEST: Verbose test message';
        const metadata = { key: 'value' };

        console.log(message, metadata)
        expect(spy).toHaveBeenCalledWith("console.log " + message, metadata);

        // Overwrites the console to do nothing at any level other than 'verbose'.
        const config: ILoggerConfig = { ...defaultConfig, level: 'debug' };
        const debugAdapter = new WinstonAdapter(config);
        const debugSpy = jest.spyOn(debugAdapter, 'verbose').mockImplementation();

        console.log(message, metadata);
        expect(debugSpy).not.toHaveBeenCalled();
    });

    // ------------------------------

    it('Handles debug messages correctly', () => {
        const spy = jest.spyOn(adapter, 'debug').mockImplementation();

        const message = 'TEST: Debug test message';
        const metadata = { key: 'value' };

        adapter.debug(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles info messages correctly', () => {
        const spy = jest.spyOn(adapter, 'info').mockImplementation();

        const message = 'TEST: Info test message';
        const metadata = { key: 'value' };

        adapter.info(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles log messages correctly', () => {
        const spy = jest.spyOn(adapter, 'log').mockImplementation();

        const message = 'TEST: Log test message';
        const metadata = { key: 'value' };

        adapter.log(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles warn messages correctly', () => {
        const spy = jest.spyOn(adapter, 'warn').mockImplementation();

        const message = 'TEST: Warn test message';
        const metadata = { key: 'value' };

        adapter.warn(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles error messages correctly', () => {
        const spy = jest.spyOn(adapter, 'error').mockImplementation();

        const message = 'TEST: Error test message';
        const metadata = { key: 'value' };

        adapter.error(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles Errors correctly', () => {
        const spy = jest.spyOn(adapter, 'error').mockImplementation();

        try {
            throw new Error('Test error');
        } catch (err: Error | unknown) {
            adapter.error('TEST: An error occurred:', err);
            expect(spy).toHaveBeenCalledWith('TEST: An error occurred:', err);
        }
    });

    // ------------------------------

    it('Handles critical messages correctly', () => {
        const spy = jest.spyOn(adapter, 'critical').mockImplementation();

        const message = 'TEST: Critical test message';
        const metadata = { key: 'value' };

        adapter.critical(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });
});
