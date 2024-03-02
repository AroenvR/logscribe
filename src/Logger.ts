import { ILogger } from "./ILogger";
import { ILoggerConfig } from "./LoggerConfig";

export class Logger implements ILogger {
    private readonly name = "Logger";
    private config: ILoggerConfig;

    constructor(config: ILoggerConfig) {
        this.config = config;
    }

    private create(message: string, metadata?: Record<string, any>): void {
    }

    verbose(message: string, metadata?: Record<string, any>): void {
        if (this.config.level === 'verbose') {
            this.create(message, metadata);
        }
    }

    debug(message: string, metadata?: Record<string, any>): void {
        if (this.config.level === 'verbose' || this.config.level === 'debug') {
            this.create(message, metadata);
        }
    }

    info(message: string, metadata?: Record<string, any>): void {
        if (this.config.level === 'verbose' || this.config.level === 'debug' || this.config.level === 'info') {
            this.create(message, metadata);
        }
    }

    log(message: string, metadata?: Record<string, any>): void {
        if (this.config.level === 'verbose' || this.config.level === 'debug' || this.config.level === 'info' || this.config.level === 'normal') {
            this.create(message, metadata);
        }
    }

    warn(message: string, metadata?: Record<string, any>): void {
        if (this.config.level === 'verbose' || this.config.level === 'debug' || this.config.level === 'info' || this.config.level === 'normal' || this.config.level === 'warn') {
            this.create(message, metadata);
        }
    }

    error(message: string, metadata?: Record<string, any>): void {
        if (this.config.level === 'verbose' || this.config.level === 'debug' || this.config.level === 'info' || this.config.level === 'normal' || this.config.level === 'warn' || this.config.level === 'error') {
            this.create(message, metadata);
        }
    }

    critical(message: string, metadata?: Record<string, any>): void {
        if (this.config.level === 'verbose' || this.config.level === 'debug' || this.config.level === 'info' || this.config.level === 'normal' || this.config.level === 'warn' || this.config.level === 'error' || this.config.level === 'critical') {
            this.create(message, metadata);
        }
    }
}