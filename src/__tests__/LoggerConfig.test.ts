import { LoggerConfigurator } from "../LoggerConfig";

describe('LoggerConfig', () => {

    it('should return default configuration when environment variables are not set', () => {
        const config = LoggerConfigurator.loadConfiguration();

        expect(config).toEqual({
            driver: 'winston',
            level: 'info',
            console: false,
            file: true,
            filePath: './logs',
        });
    });

    // TODO: Add JSON config import test
    // TODO: Add environment variable import test

});
