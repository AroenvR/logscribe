import path from "path";
import { ILoggerConfig, LoggerConfigurator } from "../../configurator/LoggerConfigurator";
import { fallbackConfig } from "../config_files/testingConfigs";

describe('LoggerConfig', () => {
    const loadedConfig: ILoggerConfig = {
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

    it('Should return a fallback configuration when nothing is given', () => {
        const configurator = new LoggerConfigurator();
        const config = configurator.loadConfiguration();

        expect(config).toEqual(fallbackConfig);
    });

    // ------------------------------

    it('Should return valid configuration when the right environment variable is set', () => {
        process.env.LOGSCRIBE_CONFIG = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
        const configurator = new LoggerConfigurator();
        const config = configurator.loadConfiguration();

        expect(config).toEqual(loadedConfig);
    });

    // ------------------------------

    it('Should return a valid configuration when given a path to load from ', () => {
        const configPath = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');
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

    // ------------------------------

    it('Environment variable configuration overrides a given configuration', () => {
        process.env.LOGSCRIBE_CONFIG = path.join(__dirname, '../', 'config_files', 'loggerConfig.json');

        const configurator = new LoggerConfigurator({ loader: "object", config: fallbackConfig });
        const config = configurator.loadConfiguration();

        expect(config).toEqual(loadedConfig);
    });
});
