var fs = require('fs'),
    Y = require('yui/handlebars'),
    
    templates = require('./templates'),

    cache = {};

/**
 * Read `path` with `options` with callback `(err, str)`.
 * When `options.cache` is true the template string will be cached.
 *
 * @param {String} path
 * @param {Object} options
 * @param {Function} fn
 */
function read(path, options, fn) {
    var str = cache[path];

    if(options.cache && str && typeof str === 'string') {
        return fn(null, str);
    }

    // read
    fs.readFile(path, 'utf8', function(err, str) {
        if(err) return fn(err);
        if(options.cache) cache[path] = str;
        fn(null, str);
    });
}

var watchHandler;

module.exports = function(path, options, fn) {
    var partials = templates.getRaw(), template, layoutStr;
    var layout = options.layout || options.settings['views layout'];
    if(options.layout !== false) {
        if((layout = options.layout)) {
            layout = options.settings['views'] + '/layouts/' + layout + '.handlebars';
            delete options.layout;
        } else {
            layout = options.settings['views'] + '/' + options.settings['views layout'] + '.handlebars';
        }
        if( ! fs.existsSync(layout)) {
            return fn('没有找到模板：' + layout);
        }
        layoutStr || (layoutStr = fs.readFileSync(layout, 'UTF-8'));
        watchHandler || (watchHandler = fs.watch(layout, function(e) {
            layoutStr = fs.readFileSync(layout, 'UTF-8');
        }));
        read(path, options, function(err, str) {
            if(err) return fn(err);
            options.filename = path;
            partials.body = str;
            template = Y.Handlebars.compile(layoutStr, options);
            try {
                fn(null, template(options, { partials: partials }));
            } catch(err) {
                fn(err);
            }
        });
    } else {
        read(path, options, function(err, str) {
            if(err) return fn(err);
            return fn(Y.Handlebars.render(str, options));
        });
    }

};


