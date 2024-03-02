import path from 'path';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { TMetadata } from '../ILogger';
import { TLogLevels } from '../LoggerConfig';
import { AbstractLogAdapter } from './AbstractLogAdapter';

/**
 * The Adapter responsible for logging messages using the Winston library.
 * @extends LogAdapter The base class for all log adapters.
 */
export class WinstonAdapter extends AbstractLogAdapter<winston.Logger> {
    protected name = "WinstonAdapter";

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
        // @ts-ignore 
        this.handle('normal', message, metadata); // log (log is used by winston)
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

    protected create() {
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

        if (this.config.console) {
            transports.push(new winston.transports.Console(this.configureConsoleTransport()));
        }

        if (this.config.file.enabled) {
            transports.push(new winston.transports.File(this.configureFileTransport()));
        }

        if (this.config.http.enabled) {
            transports.push(new winston.transports.Http(this.configureHttpTransport()));
        }

        const logger = winston.createLogger({
            levels: customLevels,
            transports: transports,
        });

        return logger;
    }

    /**
     * Writes a log entry with the given level, message, and extra data.
     * @param level The log level (e.g., 'info', 'debug', 'error', etc.).
     * @param message The log message.
     * @param extra Optional extra data to include in the log entry.
     */
    private handle(level: TLogLevels, message: string, metadata?: TMetadata): void {
        this.logger.log(level, message, { metadata });
    }

    /**
     * Configures the console transport based on the ILoggerConfig.
     * @returns A winston.transports.ConsoleTransportOptions instance.
     */
    private configureConsoleTransport(): winston.transports.ConsoleTransportOptions {
        return {
            level: this.config.level,
            silent: !this.config.console,
            format: winston.format.printf(({ level, message, metadata }) => {
                if (level === 'normal') level = "log"; // winston uses 'log' for the 'normal' level

                let dataStr = "";
                if (metadata instanceof Error) {
                    dataStr = `\n  Error Name: ${metadata.name}\n  Error Message: ${metadata.message}\n  Stack Trace:\n${metadata.stack?.split('\n').map(line => '  ' + line).join('\n')}`;
                } else {
                    dataStr = metadata ? "\n" + JSON.stringify(metadata, null, 4) : "";
                }

                return `${this.config.appName} ${level.toUpperCase()} - ${message} ${dataStr}`;
            }),
        };
    }

    /**
     * Configures the file transport based on the ILoggerConfig.
     * @returns A winston.transports.FileTransportOptions instance.
     */
    private configureFileTransport(): winston.transports.FileTransportOptions {
        if (!this.config.file.enabled) throw new Error(`${this.name}: Config file is not enabled while trying to configure file transport.`);

        if (!this.config.file.name) this.config.file.name = `${this.config.appName}_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
        if (!this.config.file.path) this.config.file.path = path.join(__dirname, '../', '../', 'logs');

        return {
            level: this.config.level,
            filename: path.join(this.config.file.path, this.config.file.name),
            silent: !this.config.file.enabled,
            format: winston.format.printf(({ level, message, metadata }) => {
                if (level === 'normal') level = "log"; // winston uses 'log' for the 'normal' level

                if (metadata instanceof Error) {
                    if (this.config.level === "verbose" || this.config.level === "debug") {
                        if (metadata.stack) metadata = `${metadata.stack.replace(/\n/g, "")}`;
                        else metadata = `${metadata.name}: ${metadata.message}`;
                    }
                    else {
                        metadata = `${metadata.name}: ${metadata.message}`;
                    }
                }

                const now = new Date();
                const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
                return `${timestamp} ${this.config.appName} ${level.toUpperCase()} - ${message} ${metadata ? JSON.stringify(metadata) : ""}`;
            }),
        };
    }

    /**
     * Configures the HTTP transport based on the ILoggerConfig.  
     * **Does not log any debug logging level.**
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A winston.transports.HttpTransportOptions instance.
     * @deprecated This method is not tested and may not work as expected.
     */
    private configureHttpTransport(): winston.transports.HttpTransportOptions {
        return {
            level: this.config.level === "debug" ? "info" : this.config.level,
            silent: !this.config.http.enabled,
            host: 'localhost',
            path: `/${uuidv4()}`,
            ssl: true,
            auth: {
                bearer: process.env.BEARER_TOKEN
            },
            format: winston.format.printf(({ level, message, metadata }) => {
                if (level === 'normal') level = "log"; // winston uses 'log' for the 'normal' level

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
}
