import * as path from 'path';
import * as fs from 'fs-extra';
import { Site } from '@getflywheel/local';
import { getLocalAppDataPath } from './getLocalAppDataPath.js';

const DB_HOST_REGEX = /define\s*\(\s*(['"])DB_HOST\1\s*,\s*(['"]).*?\2\s*\)\s*;/;

export async function patchWpConfig(site: Site): Promise<void> {
	const wpConfigPath = path.join(site.longPath, 'app', 'public', 'wp-config.php');

	if (!(await fs.pathExists(wpConfigPath))) {
		return;
	}

	const socketPath = path.join(getLocalAppDataPath(), 'run', site.id, 'mysql', 'mysqld.sock');
	const replacement = `define( 'DB_HOST', 'localhost:${socketPath}' );`;

	const contents = await fs.readFile(wpConfigPath, 'utf8');

	if (!DB_HOST_REGEX.test(contents)) {
		return;
	}

	const patched = contents.replace(DB_HOST_REGEX, replacement);

	if (patched === contents) {
		return;
	}

	await fs.writeFile(wpConfigPath, patched, 'utf8');
}
