var fs = require('fs'),
    path = require('path'),
    
    Y = require('yui/oop'),
    
    CONFIG_FILE = 'config.json',
    NODE_ENV = process.env.NODE_ENV,
    
    ENV = {
        development: NODE_ENV !== 'production',
        production: NODE_ENV === 'production'
    };

var appRoot = process.cwd(),
    configFile = path.join(__dirname, CONFIG_FILE),
    config = fs.existsSync(configFile) &&
                JSON.parse(fs.readFileSync(configFile, 'utf8'));

if(!config) {
    console.error('读取配置文件失败：' + configFile);
    process.exit(1);
}

config.env = ENV;
config.pubDir = path.join(appRoot, config.pubDir);
config.templatesDir = path.join(appRoot, config.templatesDir);

// YUI on the server
config.yui.server = {
    useSync: true,
    filter: ENV.production ? 'min' : 'raw', 
    groups: {
        server: Y.merge(Y.clone(config.yui.server), {
            base: path.join(config.pubDir, config.yui.server.base),
            combine: false
        }),
        onm: Y.merge(Y.clone(config.yui.onm), {
            base: path.join(config.pubDir, config.yui.onm.base),
            combine: false
        })
    }
};

// YUI on the client
config.yui.client = {
    allowRollup: false,
    combine: ENV.production,
    filter: ENV.production ? 'min' : 'raw',
    groups: {
        client: Y.clone(config.yui.client),
        onm: Y.merge(Y.clone(config.yui.onm), {
            combine: ENV.production
        })
    }
};

global.config = module.exports = config;
