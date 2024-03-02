import path from "path";
import { ILogger, TMetadata } from "../ILogger";
import { ILoggerConfig } from "../LoggerConfigurator";

/**
 * The base class for all log adapters.  
 */
export abstract class AbstractAdapter<T> implements ILogger {
    protected name = "AbstractAdapter";
    protected logger: T;
    private _config: ILoggerConfig;

    constructor(config: ILoggerConfig) {
        this._config = config;

        // If the environment variable TAIL_TESTING is set to 'true', the log file is written to the logs directory in the project root as tail.test.log.
        if (process.env.TAIL_TESTING === "true") {
            this.config.file = {
                enabled: true,
                path: path.join(__dirname, '../', '../', 'logs'),
                name: "tail.test.log",
            }
        }

        this.overwriteConsole();

        this.logger = this.create();
    }

    public abstract verbose(message: string, metadata?: TMetadata): void;
    public abstract debug(message: string, metadata?: TMetadata): void;
    public abstract info(message: string, metadata?: TMetadata): void;
    public abstract log(message: string, metadata?: TMetadata): void;
    public abstract warn(message: string, metadata?: TMetadata): void;
    public abstract error(message: string, metadata?: TMetadata): void;
    public abstract critical(message: string, metadata?: TMetadata): void;

    /**
     * Creates the logger instance based on the configuration settings. 
     */
    protected abstract create(): T;

    /**
     * Overwrites the default console logging functions.  
     * If the logging level is set to 'verbose', all console logging functions are overwritten to log to the logger.  
     * Otherwise all console logging functions are overwritten to do nothing.
     */
    private overwriteConsole(): void {
        if (this.config.level !== "verbose") {
            console.debug = () => { };
            console.log = () => { };
            console.info = () => { };
            console.warn = () => { };
            console.error = () => { };
        }
        else {
            console.debug = (...args: any[]) => {
                this.verbose(`console.debug ${args[0]}`, args[1]);
            }

            console.log = (...args: any[]) => {
                this.verbose(`console.log ${args[0]}`, args[1]);
            }

            console.info = (...args: any[]) => {
                this.verbose(`console.info ${args[0]}`, args[1]);
            }

            console.warn = (...args: any[]) => {
                this.verbose(`console.warn ${args[0]}`, args[1]);
            }

            console.error = (...args: any[]) => {
                this.verbose(`console.error ${args[0]}`, args[1]);
            }
        }
    }

    public get config(): ILoggerConfig {
        return this._config;
    }
}