const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ESBuildPlugin } = require('esbuild-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const _package = require('../package.json');
const build = require('./build');

module.exports = {
	entry: './src/index.jsx',
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			components: path.resolve(__dirname, '../src/', 'components'),
			modules: path.resolve(__dirname, '../src/', 'modules'),
			utils: path.resolve(__dirname, '../src/', 'utils'),
			store: path.resolve(__dirname, '../src/', 'store'),
		},
	},
	module: {
		rules: [
			{
				// "oneOf" will traverse all following loaders until one will
				// match the requirements. When no loader matches it will fall
				// back to the "file" loader at the end of the loader list.
				oneOf: [
					// "url" loader works just like "file" loader but it also embeds
					// assets smaller than specified size as data URLs to avoid requests.
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
						include: path.resolve(__dirname, '../assets/images/'),
						loader: require.resolve('file-loader'),
						options: {
							limit: 10000,
							name: '[name].[ext]',
							outputPath: 'assets/images',
							publicPath: '/assets/images/',
						},
					},
					// {
					// 	test: [/\.svg$/],
					// 	loader: require.resolve('./util/svg-sprite-loader/loader'),
					// 	include: [/sprite-svg/],
					// 	options: {
					// 		extract: true,
					// 		spriteFilename: 'assets/svg/sprite.svg',
					// 	},
					// },
					{
						test: [/\.eot$/, /\.(woff|woff2)$/, /\.ttf$/, /\.svg$/],
						include: path.resolve(__dirname, '../assets/fonts/'),
						loader: require.resolve('file-loader'),
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/fonts',
							publicPath: '/assets/fonts/',
						},
					},
					{
						test: [/\.eot$/, /\.(woff|woff2)$/, /\.ttf$/, /\.svg$/],
						include: path.resolve(__dirname, '../node_modules/@fortawesome/'),
						loader: require.resolve('file-loader'),
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/icons',
							publicPath: '/assets/icons/',
						},
					},
					{
						test: /\.(js|jsx)$/,
						include: path.resolve(__dirname, '../src/'),
						loader: 'esbuild-loader',
						options: {
							loader: 'jsx', // Remove this if you're not using JSX
							target: 'es2015', // Syntax to compile to (see options below for possible values)
						},
					},
					// Process SCSS
					{
						test: /\.(css|scss)$/,
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: 'css-loader',
							},
							{
								loader: require.resolve('sass-loader'),
							},
						],
					},
					{
						loader: require.resolve('file-loader'),
						exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/, /node_modules/],
						options: {
							name: 'assets/[name].[hash:8].[ext]',
						},
					},
					// ** STOP ** Are you adding a new loader?
					// Make sure to add the new loader(s) before the "file" loader.
				],
			},
		],
	},
	plugins: [
		new ESBuildPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: _package.description,
			template: './src/index.html',
			favicon: './src/favicon.ico',
			scriptLoading: 'defer',
			buildInfo: build.info,
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/styles/bundle.css',
		}),
		// new CopyWebpackPlugin({
		// 	patterns: [
		// 		'./src/manifest.json',
		// 		'./src/web.config',
		// 		'./src/site.webmanifest',
		// 		'./src/android-chrome-192x192.png',
		// 		'./src/android-chrome-512x512.png',
		// 		'./src/apple-touch-icon.png',
		// 		'./src/favicon-16x16.png',
		// 		'./src/favicon-32x32.png',
		// 		{
		// 			from: path.join(__dirname, '../assets/images'),
		// 			to: path.join(__dirname, '../dist/assets/images'),
		// 			toType: 'dir',
		// 		},
		// 	],
		// }),
	],
	// what is this, this breaks the build !?!?
	// externals: {
	// 	react: {
	// 		commonjs: 'react',
	// 		commonjs2: 'react',
	// 		amd: 'React',
	// 		root: 'React',
	// 	},
	// 	'react-dom': {
	// 		commonjs: 'react-dom',
	// 		commonjs2: 'react-dom',
	// 		amd: 'ReactDOM',
	// 		root: 'ReactDOM',
	// 	},
	// },
	// performance tweaks
	node: {
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty',
	},
};
