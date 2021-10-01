const path = require('path');
const Dotenv = require('dotenv-webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	// devtool: 'source-map',
	plugins: [
		new Dotenv({
			path: './config/.env/.env.production',
		}),
	],
	devServer: {
		contentBase: './dist',
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				sourceMap: true, // same size whatever the flag value
				terserOptions: {
					keep_fnames: /./,
				},
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
		usedExports: true,
	},
	output: {
		path: path.resolve(__dirname, '../', 'dist'),
		publicPath: '/',
		filename: 'bundle.js',
	},
};
