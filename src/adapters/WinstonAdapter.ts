import path from 'path';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { ILogger, TMetadata } from '../ILogger';
import { ILoggerConfig, TLogLevels } from '../LoggerConfig';

abstract class LogAdapter implements ILogger {
    protected logger: ILogger;
    protected config: ILoggerConfig;

    constructor(config: ILoggerConfig) {
        this.config = config;
        this.logger = this.createLogger(config);

        if (config.level === "verbose") {
            this.overwriteConsole();
        }
        else {
            this.noConsole();
        }
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
     * @param config - {@link ILoggerConfig} object containing the logger configuration. 
     */
    protected abstract createLogger(config: ILoggerConfig): ILogger;

    /**
     * Overwrites the console methods to log to the application's logger instead.
     */
    private overwriteConsole(): void {
        console.debug = (...args: any[]) => {
            this.verbose(`console.debug ${args[0]} `, args[1]);
        }

        console.log = (...args: any[]) => {
            this.verbose(`console.log ${args[0]} `, args[1]);
        }

        console.info = (...args: any[]) => {
            this.verbose(`console.info ${args[0]} `, args[1]);
        }

        console.warn = (...args: any[]) => {
            this.verbose(`console.warn ${args[0]} `, args[1]);
        }

        console.error = (...args: any[]) => {
            this.verbose(`console.error ${args[0]} `, args[1]);
        }
    }

    /**
     * Overwrites the console methods to do nothing.
     */
    private noConsole(): void {
        console.debug = () => { };
        console.log = () => { };
        console.info = () => { };
        console.warn = () => { };
        console.error = () => { };
    }
}

/**
 * WinstonAdapter class translates ILogger interface calls to Winston's logging methods.
 */
export class WinstonAdapter implements ILogger {
    private logger: winston.Logger;
    private config: ILoggerConfig;

    constructor(config: ILoggerConfig) {
        this.config = config;
        this.logger = this.createLogger(config);

        this.critical("Logger initialized. Config:", config);
    }

    public verbose(message: string, metadata?: TMetadata): void {
        this.handle('verbose', message, metadata);
    }

    public debug(message: string, metadata?: TMetadata): void {
        this.handle('debug', message, metadata);
    }

    public info(message: string, metadata?: TMetadata): void {
        this.handle('info', message, metadata);
    }

    public log(message: string, metadata?: TMetadata): void {
        this.handle('log', message, metadata);
    }

    public warn(message: string, metadata?: TMetadata): void {
        this.handle('warn', message, metadata);
    }

    public error(message: string, metadata?: TMetadata): void {
        this.handle('error', message, metadata);
    }

    public critical(message: string, metadata?: TMetadata): void {
        this.handle('critical', message, metadata); // Winston does not have a 'critical' level by default, mapping to 'error'
    }

    /**
     * Writes a log entry with the given level, message, and extra data.
     * @param level The log level (e.g., 'info', 'debug', 'error', etc.).
     * @param message The log message.
     * @param extra Optional extra data to include in the log entry.
     */
    private async handle(level: TLogLevels, message: string, metadata?: TMetadata): Promise<void> {
        // @ts-ignore
        if (level === "log") level === "normal";
        if (!metadata) {
            this.logger.log(level, message);
            return;
        }

        if (metadata instanceof Error) {
            metadata = {
                name: metadata.name,
                message: metadata.message,
                stack: metadata.stack,
            };
        }

        // if (metadata instanceof Error) {
        //     if (this.config.level === "verbose" || this.config.level === "debug") {
        //         metadata = {
        //             Name: metadata.name,
        //             Message: metadata.message,
        //             Stack: metadata.stack,
        //         };
        //     }
        //     else {
        //         metadata = {
        //             Name: metadata.name,
        //             Message: metadata.message,
        //         };
        //     }
        // }

        this.logger.log(level, message, { metadata });
    }

    private createLogger(config: ILoggerConfig) {
        const customLevels = {
            critical: 0,
            error: 1,
            warn: 2,
            normal: 3, // log (log is used by winston)
            info: 4,
            debug: 5,
            verbose: 6,
        };

        const transports: winston.transport[] = [];

        if (config.console) {
            transports.push(new winston.transports.Console(this.configureConsoleTransport(config)));
        }

        if (config.file) {
            transports.push(new winston.transports.File(this.configureFileTransport(config)));
        }

        if (config.http) {
            transports.push(new winston.transports.Http(this.configureHttpTransport(config)));
        }

        const logger = winston.createLogger({
            levels: customLevels,
            transports: transports,
        });

        // Overwrite console methods for logging
        if (config.level === "verbose") {
            this.overwriteConsole();
        }
        else {
            this.noConsole();
        }

        return logger;
    }

    /**
     * Configures the console transport based on the ILoggerConfig.
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A winston.transports.ConsoleTransportOptions instance.
     */
    private configureConsoleTransport(config: ILoggerConfig): winston.transports.ConsoleTransportOptions {
        return {
            level: config.level,
            silent: !config.console,
            format: winston.format.printf(({ level, message, metadata }) => {
                if (level === 'normal') level = "log";

                return `${this.config.appName} ${level.toUpperCase()} - ${message} ${metadata ? JSON.stringify(metadata, null, 4) : ""}`;
            }),
        };
    }

    /**
     * Configures the file transport based on the ILoggerConfig.
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A winston.transports.FileTransportOptions instance.
     */
    private configureFileTransport(config: ILoggerConfig): winston.transports.FileTransportOptions {
        const file = `${config.appName}_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
        const filepath = config.filePath ?? path.join(__dirname, 'logs');

        return {
            level: config.level,
            filename: path.join(filepath, file),
            silent: !config.file,
            format: winston.format.printf(({ level, message, metadata }) => {
                const now = new Date();
                const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
                if (level === 'normal') level = "log";

                return `${timestamp} ${this.config.appName} ${level.toUpperCase()} - ${message} ${metadata ? JSON.stringify(metadata) : ""}`;
            }),
        };
    }

    /**
     * Configures the HTTP transport based on the ILoggerConfig.  
     * **Does not log any debug logging level.**
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A winston.transports.HttpTransportOptions instance.
     */
    private configureHttpTransport(config: ILoggerConfig): winston.transports.HttpTransportOptions {
        return {
            level: config.level === "debug" ? "info" : config.level,
            silent: config.http,
            host: 'localhost',
            path: `/${uuidv4()}`,
            ssl: true,
            auth: {
                bearer: process.env.BEARER_TOKEN
            },
            format: winston.format.printf(({ level, message, metadata }) => {
                if (level === 'normal') level = "log";

                const payload = {
                    level: level.toUpperCase(),
                    appName: this.config.appName,
                    timestamp: new Date().getTime(),
                    message: message,
                    metadata: metadata instanceof Error ? {
                        error: true,
                        name: metadata.name,
                        message: metadata.message,
                        stack: metadata.stack
                    } : metadata,
                };

                return JSON.stringify(payload);
            }),
        }
    }

    /**
     * Overwrites the console methods to log to the application's logger instead.
     */
    private overwriteConsole(): void {
        console.debug = (...args: any[]) => {
            this.verbose(`console.debug ${args[0]} `, args[1]);
        }

        console.log = (...args: any[]) => {
            this.verbose(`console.log ${args[0]} `, args[1]);
        }

        console.info = (...args: any[]) => {
            this.verbose(`console.info ${args[0]} `, args[1]);
        }

        console.warn = (...args: any[]) => {
            this.verbose(`console.warn ${args[0]} `, args[1]);
        }

        console.error = (...args: any[]) => {
            this.verbose(`console.error ${args[0]} `, args[1]);
        }
    }

    /**
     * Overwrites the console methods to do nothing.
     */
    private noConsole(): void {
        console.debug = () => { };
        console.log = () => { };
        console.info = () => { };
        console.warn = () => { };
        console.error = () => { };
    }
}
