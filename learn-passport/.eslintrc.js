module.exports = {
	env: {
		browser: true,
		commonjs: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 6,
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
	},
};
