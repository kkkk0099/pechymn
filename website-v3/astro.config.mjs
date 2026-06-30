// @ts-check
import { defineConfig } from 'astro/config';

const BUILD_VERSION = process.env.PUBLIC_BUILD_VERSION || `${Date.now()}`;
const BASE_PATH = process.env.PUBLIC_BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	base: BASE_PATH,
	vite: {
		define: {
			__APP_BUILD_VERSION__: JSON.stringify(BUILD_VERSION),
		},
	},
	devToolbar: {
	enabled: false,
	},
});
