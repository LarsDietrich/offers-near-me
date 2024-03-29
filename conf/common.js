var config = require('./config');

module.exports = {
    env: config.env,
    layout: config.layout,
    min: config.env.production ? '-min' : '',
    yui_config: JSON.stringify(config.yui.client),
    yui_version: config.yui.version
};
