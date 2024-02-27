import path from "path";
import { ILoggerConfig, Logger } from "../Logger";

describe('Logger', () => {
    const loggerConfig: ILoggerConfig = {
        level: "debug",
        console: true,
        http: false,
        file: true,
        filePath: path.join(__dirname, "logs")
    };

    beforeAll(() => {
        Logger.create(loggerConfig);
    });

    test('Logs at the debug level', async () => {
        Logger.instance.debug("This is a debug message");
    });

});