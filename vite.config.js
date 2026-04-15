import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pluginChecker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

const chunkMap = [
	{ name: 'vendor', deps: ['react', 'react-dom'] },
	{ name: 'audio', deps: ['howler'] },
	{ name: 'three', deps: ['three'] },
	{ name: 'redux', deps: ['@reduxjs', 'react-redux'] },
	{ name: 'i18n', deps: ['i18next'] },
	{ name: 'zip', deps: ['jszip'] },
	{ name: 'icons', deps: ['react-icons'] },
	{ name: 'storage', deps: ['localforage'] },
	{ name: 'toastify', deps: ['react-toastify'] },
];

export default defineConfig({
	base: './',
	plugins: [
		react(),
		svgr({
			exportAsDefault: false,
		}),
		pluginChecker({ typescript: true }),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) return;

					for (const chunk of chunkMap) {
						if (chunk.deps.some((dep) => id.includes(dep))) {
							return chunk.name;
						}
					}

					return 'vendor';
				},
			},
		},
	},
});
