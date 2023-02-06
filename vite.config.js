/// <reference types="vitest" />
/// <reference types="vite/client" />
const react = require('@vitejs/plugin-react');
const path = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'lib/index.js'),
			name: '@rvision/use-form',
			fileName: format => `index.${format}.js`,
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['react', 'react-dom'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					react: 'react',
					'react-dom': 'react-dom',
				},
			},
		},
	},
});
