require('./conf/config');

var express = require('express'),
    YUI = require('yui').YUI,
    combo = require('combohandler'),

    app = express(),
    Y = YUI(global.config.yui.server),
    
    pubDir = config.pubDir;

// -- YUI config ---------------------------------------------------------------
Y.use('parallel');

// -- Express config -----------------------------------------------------------
app.engine('handlebars', require('./lib/view'));
app.set('view engine', 'handlebars');
app.set('view layout', config.layout);
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.errorHandler());
app.use(express.static(pubDir));
app.use(express.favicon());
app.configure('development', function() {
    // Gives us pretty logs in development. Must run before other middleware.
    app.use(express.logger(
        '[:date] :req[x-forwarded-for] ":method :url" :status [:response-time ms]'
    ));
});
app.configure('production', function() {
    app.enable('minify templates');
    app.enable('minify js');

});
app.locals(Y.merge(require('./conf/common'), {
    config: global.config
}));

app.get('/', function(req, res) {
    res.render('index', {
    });
});

app.get('/combo', combo.combine({ rootPath: pubDir + '/js' }), function(req, res) {
    var js = res.body,
        minify;
    if(app.enabled('minify js')) {
        minify = require('uglify-js');
        js = minify(js);
    }
    res.send(js, 200);
});

// Dymanic resource for precompiled templates.
app.get('/templates.js', function(req, res, next) {
    var precompiled = require('./lib/templates').getPrecompiled(),
        templates = [];

    Y.Object.each(precompiled, function(template, name) {
        templates.push({
            name: name,
            template: template
        });
    });

    res.render('templates', {
        layout: false,
        templates: templates
    }, function(err, view) {
        if(err) {
            return next(err);
        }
        var templates = view,
            minify;
        if(app.enabled('minify templates')) {
            minify = require('uglify-js');
            templates = minify(templates);
        }
        res.set('Content-Type', 'application/javascript');
        res.send(200, templates);
    });
});


app.listen(3000);
console.log('Listening on port 3000');

