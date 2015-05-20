requirejs.config({
    "baseUrl": "/js/lib",
    "shim": {
        "bootstrap": { "deps": ["jquery"] },
        "moment-local": { "deps": ["moment"] },
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
        "JSXTransformer": "../vendor/JSXTransformer"
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
