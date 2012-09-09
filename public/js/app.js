YUI.add('onm-app', function(Y) {

    var L = Y.Lang,
        App = Y.App;

    function OnmApp() {
    }

    Y.extend(OnmApp, App, {
    }, {
    });


    Y.OnmApp = OnmApp;
},
'0.0.1',
{ requires: [ "app-base", "app-transitions", "gallery-geo" ] }
);
