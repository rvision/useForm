//"module": "commonjs"

module.exports = {
	parser: 'babel',
	printWidth: 170, // wrap lines at
	tabWidth: 4, // indentation
	useTabs: true, // tabs instead of spaces
	semi: true, // add semicolons to end of statements
	singleQuote: true, // force single quotes where possible
	quoteProps: 'as-needed', // only required for some props
	jsxSingleQuote: false, // jsx prop quotes
	trailingComma: 'all', // es5?
	bracketSpacing: true, // { foo: bar } instead of {foo: bar}
	jsxBracketSameLine: false, // https://prettier.io/docs/en/options.html#jsx-brackets
	arrowParens: 'avoid', // x => {}
	// "rangeStart": 0,
	// "rangeEnd": 0,
	// "parser": "babel",
	// "filepath": "",
	requirePragma: false,
	//"insertPragma": false,
	proseWrap: 'preserve',
	htmlWhitespaceSensitivity: 'css',
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'auto',
	vueIndentScriptAndStyle: false,
};

