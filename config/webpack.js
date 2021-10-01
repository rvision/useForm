/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const { merge } = require('webpack-merge');
const rootConfig = require('./webpack.config');

const getAddons = addonsArgs => {
	const addons = Array.isArray(addonsArgs) ? addonsArgs : [addonsArgs];
	return addons.filter(Boolean).map(name => require(`./addons/webpack.${name}.js`));
};

// merges environment specific config with rootConfig and exports it
module.exports = ({ env, addon }) => {
	const envConfig = require(`./webpack.config.${env}.js`);
	return merge(rootConfig, envConfig, ...getAddons(addon));
};
