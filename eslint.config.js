import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				project: './tsconfig.json', // REQUIRED for no-floating-promises
			},
		},
	},
	tseslint.configs.recommended,
	{
		...pluginReact.configs.flat.recommended,
		settings: {
			react: {
				version: '19.1.0',
			},
		},
		rules: {
			...pluginReact.configs.flat.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-floating-promises': 'warn',
		},
	},
]);
