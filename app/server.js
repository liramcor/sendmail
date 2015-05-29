// Se agrega este código para poder llamar este archivo
// usando el método require...  (require("modulo"));
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define("server",
[
    "body-parser",
    "chalk",
    "express",
    "morgan",
    "path",
    "swig",
    "http"
],
function(
    bodyParser,
    chalk,
    express,
    morgan,
    path,
    swig,
    http
){
    var app = express();
    var port = process.env.PORT || 3000;
    var __dirname = path.resolve(path.dirname());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.text({ type: "text/html" }));

    // HTML ENGINE
    app.engine("html", swig.renderFile);

    app.set("view engine", "html");
    app.set("views", __dirname + "/app/views");
    app.set("view cache", false);
    swig.setDefaults({ cache: false, varControls: ["<%=", "%>"] });

    // STATIC FOLDERS
    app.use(express.static(__dirname + "/public"));

    var server = http.createServer(app).listen(port, function() {
        console.log(chalk.red("Express server listening on port " + port));
    });

    // INITIALIZE SOCKET.IO
    var io = require("socket.io").listen(server);

    io.on("connection", function(socket){
        socket.on("greeting", function(data){
            console.log("Saludo recibido desde " + data.greeting);
        });

        socket.emit("greeting");
    })

    app.use("/", require("routes/index"));
});