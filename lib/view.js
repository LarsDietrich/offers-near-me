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

module.exports = function(path, options, fn) {
    var partials = templates.getRaw(), template;
    read(path, options, function(err, str) {
        if(err) {
            return fn(err);
        }
        try {
            options.filename = path;
            template = Y.Handlebars.compile(str, options);
            fn(null, template(options, { partials: partials }));
        } catch(err) {
            fn(err);
        }
    });
};


