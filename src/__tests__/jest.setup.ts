import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs-extra';
import { testLogDir, testLogFilename } from './config_files/testingConfigs';

afterEach(() => {
	jest.clearAllMocks();
	jest.restoreAllMocks();
	jest.resetAllMocks();

	const filePath = `${testLogDir}/${testLogFilename}`;
	if (fs.existsSync(filePath)) fs.rmSync(filePath);

	process.env.LOGSCRIBE_CONFIG = '';
});
