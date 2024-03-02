import path from "path";
import { ILoggerConfig, LoggerConfigurator } from "../LoggerConfigurator";
import { defaultConfig } from "./defaultConfig";

describe('LoggerConfig', () => {
    const loadedConfig = {
        appName: 'JestTest',
        driver: 'winston',
        level: 'verbose',
        console: true,
        file: {
            enabled: false,
        },
        http: {
            enabled: false,
        }
    }

    // ------------------------------

    it('Should return default configuration when nothing is given', () => {
        const configurator = new LoggerConfigurator();
        const config = configurator.loadConfiguration();

        expect(config).toEqual(defaultConfig);
    });

    // ------------------------------

    it('Should return valid configuration when the right environment variable is set', () => {
        process.env.LOGSCRIBE_CONFIG = path.join(__dirname, 'loggerConfig.json');
        const configurator = new LoggerConfigurator();
        const config = configurator.loadConfiguration();

        expect(config).toEqual(loadedConfig);
    });

    // ------------------------------

    it('Should return a valid configuration when given a path to load from ', () => {
        const configPath = path.join(__dirname, 'loggerConfig.json');
        const configurator = new LoggerConfigurator({ loader: "file", path: configPath });
        const config = configurator.loadConfiguration();

        expect(config).toEqual(loadedConfig);
    });

    // ------------------------------

    it('Should return a valid configuration when given an object to load from ', () => {
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
        const configurator = new LoggerConfigurator({ loader: "object", config: defaultConfig });
        const config = configurator.loadConfiguration();

        expect(config).toEqual(loadedConfig);
    });
});
