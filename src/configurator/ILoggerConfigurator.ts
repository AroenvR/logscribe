import { ILoggerConfig, TLoggerOptions } from "../ILoggerConfiguration";

/**
 * Interface for the logger configurator.
 * @property opts The options for the logger configurator.
 * @property config The configuration settings for the logger.
 */
export interface ILoggerConfigurator {
    opts: TLoggerOptions | null;
    config: ILoggerConfig | null;

    /**
     * Loads the configuration settings.
     * @returns The configuration settings for the logger.
     * @devnote  
     * Will check the environment variable LOGSCRIBE_CONFIG for a configuration file first.  
     * If the environment variable is not set, it will load the configuration based on the provided options.  
     * If no options are provided, it will return the default configuration.
     */
    loadConfiguration(fallbackConfig?: ILoggerConfig): ILoggerConfig;
}