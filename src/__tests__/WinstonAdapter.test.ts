import path from 'path';
import { ILoggerConfig } from '../LoggerConfig';
import { WinstonAdapter } from '../adapters/WinstonAdapter';

describe('WinstonAdapter', () => {
    const config: ILoggerConfig = {
        appName: 'JestTest',
        driver: 'winston',
        level: 'debug',
        console: true,
        file: {
            enabled: true,
            path: path.join(__dirname, 'logs'),
        },
        http: {
            enabled: false
        }
    }

    let adapter: WinstonAdapter;

    beforeEach(() => {
        adapter = new WinstonAdapter(config);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    // ------------------------------

    it("should correctly configure the console transport", () => {
        // const spy = jest.spyOn(adapter, 'configureConsoleTransport');
        // adapter.configure();
        // expect(spy).toHaveBeenCalledWith(config);
    });

    it.only('should correctly log messages at all levels', () => {
        // const spy = jest.spyOn(adapter, 'error');

        console.log(`Console message`);

        adapter.debug("Debug message");
        adapter.info("Info message");
        adapter.log("Log message");
        adapter.warn("Warn message");
        adapter.error("Error message");
        adapter.critical("Critical message");

        // adapter.log("Metadata message:", { foo: "bar" });
        // expect(spy).toHaveBeenCalledWith(testMessage, metadata);

        try {
            throw new Error("I threw in a test!");
        } catch (err: Error | unknown) {
            adapter.error("An error occurred:", err);
            // expect(spy).toHaveBeenCalledWith(testMessage, err);
        }
    });

    // ------------------------------

    it('should correctly handle Error metadata', () => {
        const spy = jest.spyOn(adapter, 'log');
        const errorMessage = "Error message";
        const error = new Error(errorMessage);

        adapter.error(errorMessage, error);
        expect(spy).toHaveBeenCalledWith('error', errorMessage, { stack: error.stack, ...error });
    });

    // Additional tests can be added to cover more specific scenarios or edge cases
});
