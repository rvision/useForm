const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new Dotenv({
			path: './config/.env/.env.development',
		}),
	],
	devServer: {
		contentBase: './dist',
		hot: true,
		// serve over gzip
		compress: true,
		historyApiFallback: true,
	},
	output: {
		publicPath: '/',
	},
	// Turn off performance hints during development because we don't do any
	// splitting or minification in interest of speed. These warnings become
	// cumbersome.
	performance: {
		hints: false,
	},
};
