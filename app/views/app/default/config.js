requirejs.config({
    "baseUrl": "/js/lib",
    "shim": {
        "bootstrap": { "deps": ["jquery"] },
        "moment-local": { "deps": ["moment"] },
        "fileupload" : { "deps" : ["jquery","jquery.ui.widget"] }
    },
    "paths": {
        "jquery": ["../vendor/jquery.min"],
        "bootstrap": ["../vendor/bootstrap.min"],
        "underscore": ["../vendor/underscore-min"],
        "q": ["../vendor/q"],
        "io": ["/socket.io/socket.io.js", "//cdn.socket.io/socket.io-1.2.0"],
        "moment": ["../vendor/moment"],
        "moment-local": ["../vendor/moment-with-locales.min"],
        "react": "../vendor/react",
        "JSXTransformer": "../vendor/JSXTransformer",
        "jquery.ui.widget" : "../vendor/jquery.ui.widget",
        "fileupload" : "../vendor/jquery.fileupload"
    }

});


require(
[
    "jquery"
],
function
(
    $
){

});
