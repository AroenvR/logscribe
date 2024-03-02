import { WinstonAdapter } from '../adapters/WinstonAdapter';
import { ILoggerConfig } from "../LoggerConfigurator";

const defaultConfig: ILoggerConfig = {
    appName: 'JestTest',
    driver: 'winston',
    level: 'verbose',
    console: true,
    file: {
        enabled: false,
    },
    http: {
        enabled: false
    }
}

describe('WinstonAdapter', () => {
    const adapter = new WinstonAdapter(defaultConfig);

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    it('Handles verbose messages correctly', () => {
        const spy = jest.spyOn(adapter, 'verbose').mockImplementation();

        const message = 'Verbose test message';
        const metadata = { key: 'value' };

        adapter.verbose(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Overwrites the console correctly', () => {
        const spy = jest.spyOn(adapter, 'verbose').mockImplementation();

        const message = 'Verbose test message';
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

        const message = 'Debug test message';
        const metadata = { key: 'value' };

        adapter.debug(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles info messages correctly', () => {
        const spy = jest.spyOn(adapter, 'info').mockImplementation();

        const message = 'Info test message';
        const metadata = { key: 'value' };

        adapter.info(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles log messages correctly', () => {
        const spy = jest.spyOn(adapter, 'log').mockImplementation();

        const message = 'Log test message';
        const metadata = { key: 'value' };

        adapter.log(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles warn messages correctly', () => {
        const spy = jest.spyOn(adapter, 'warn').mockImplementation();

        const message = 'Warn test message';
        const metadata = { key: 'value' };

        adapter.warn(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });

    // ------------------------------

    it('Handles error messages correctly', () => {
        const spy = jest.spyOn(adapter, 'error').mockImplementation();

        const message = 'Error test message';
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
            adapter.error('An error occurred:', err);
            expect(spy).toHaveBeenCalledWith('An error occurred:', err);
        }
    });

    // ------------------------------

    it('Handles critical messages correctly', () => {
        const spy = jest.spyOn(adapter, 'critical').mockImplementation();

        const message = 'Critical test message';
        const metadata = { key: 'value' };

        adapter.critical(message, metadata);
        expect(spy).toHaveBeenCalledWith(message, metadata);
    });
});
