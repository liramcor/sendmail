var requirejs = require("requirejs");

requirejs.config({
    nodeRequire: require,
    baseUrl: "./app",
    name: "server",
    config: {
        moment: {
            noGlobal: true
        }
    }
});

requirejs(
[
    "server"
],
function(server){
    var chai = require("chai");
    var chaiAsPromised = require("chai-as-promised");
    var expect = chai.expect;
    chai.use(chaiAsPromised);

    global.expect = expect;
});
