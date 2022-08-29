module.exports = {
	parser: './node_modules/babel-eslint',
	settings: {
		'import/resolver': {
			node: {
				paths: ['src'],
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: ['airbnb', 'prettier', 'prettier/react'],
	plugins: ['prettier', 'react-hooks'],
	rules: {
		'prettier/prettier': ['warn'],
		'import/no-extraneous-dependencies': 0,
		'jsx-a11y/anchor-is-valid': 0,
		'jsx-a11y/click-events-have-key-events': 0,
		'jsx-a11y/no-static-element-interactions': 0,
		'jsx-a11y/no-noninteractive-element-interactions': 0,
		'react/jsx-filename-extension': 0,
		'import/no-cycle': 0,
		'no-console': 'off',
		'no-shadow': 'off',
		'no-plusplus': 'off',
		'react/jsx-indent': [1, 'tab', { checkAttributes: false, indentLogicalExpressions: true }],
		'react/jsx-props-no-spreading': 0,
		'react/jsx-one-expression-per-line': 0,
		'react/react-in-jsx-scope': 0, // vite does this automatically
		'no-param-reassign': 0,
		'react/forbid-prop-types': [0],
		'react/prop-types': [0],
		'react/require-default-props': [0],
		'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
		'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
	},
};
