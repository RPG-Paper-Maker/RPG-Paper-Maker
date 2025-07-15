import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import pluginChecker from 'vite-plugin-checker';

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
				manualChunks: {
					vendor: ['react', 'react-dom'],
					audio: ['howler'],
					three: ['three'],
					redux: ['@reduxjs/toolkit', 'react-redux'],
					i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
					zip: ['jszip'],
					icons: ['react-icons'],
					storage: ['localforage'],
					toastify: ['react-toastify'],
				},
			},
		},
	},
});
