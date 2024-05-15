/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import path from 'path';
import analyze from 'rollup-plugin-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
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
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: {
				exports: 'named',
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					react: 'react',
					'react-dom': 'react-dom',
					'react/jsx-runtime': 'react/jsx-runtime',
				},
			},
			plugins: [
				analyze({
					summaryOnly: true,
					showExports: true,
				}),
				visualizer({
					template: 'treemap', // sunburst, treemap, network
				}),
			],
		},
	},
});
