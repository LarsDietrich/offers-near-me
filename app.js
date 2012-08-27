require('./conf/config');

var express = require('express'),
    YUI = require('yui').YUI,

    app = express(),
    Y = YUI(global.config.yui.server),
    
    pubDir = config.pubDir;

app.engine('handlebars', require('./lib/view'));
app.set('view engine', 'handlebars');
app.set('views layout', config.layout);
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('index', {
        layout: 'non'
    });
});


app.listen(3000);
console.log('Listening on port 3000');

