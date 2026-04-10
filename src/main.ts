import * as LocalMain from '@getflywheel/local/main';
import { Site } from '@getflywheel/local';
import { patchWpConfig } from './helpers/patchWpConfig.js';

export default function (): void {
	LocalMain.HooksMain.addAction('siteStarted', async (site: Site) => {
		try {
			await patchWpConfig(site);
		} catch {
			// Silent by design — see PRD.
		}
	});
}
