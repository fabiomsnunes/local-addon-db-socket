import * as os from 'os';
import * as path from 'path';

export function getLocalAppDataPath(): string {
	switch (process.platform) {
		case 'darwin':
			return path.join(os.homedir(), 'Library', 'Application Support', 'Local');
		case 'win32':
			return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Local');
		default:
			return path.join(os.homedir(), '.config', 'Local');
	}
}
