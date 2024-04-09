// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		...eslint.configs.recommended,
		rules: {
			...eslint.configs.recommended.rules,
			'no-mixed-spaces-and-tabs': 'off',
		},
	},
	...tseslint.configs.recommended
);
