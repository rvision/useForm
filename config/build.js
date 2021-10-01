const package = require('../package.json');
// returns build information to be inserted as attribute in output HTML
module.exports = {
	info: `${package.description}`,
};
