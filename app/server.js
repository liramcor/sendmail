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


    var fs = require("fs");
    if(fs.existsSync(__dirname + "/attachments/2015-03-18.jpg"))
    {
        var nodemailer = require("nodemailer");
        // var transport = nodemailer.createTransport("SMTP",{
        //     host : "mail.scatel.com.mx",
        //     secureConnection : false,
        //     port : 26,
        //     auth : {
        //         user : "ivanhoe@scatel.com.mx",
        //         pass : "Ivan106+-*/0"
        //     }
        // });
        fs.readFile(__dirname + "/attachments/2015-03-18.jpg", function(err,data){
            if (!err) {
                var transport = nodemailer.createTransport("SMTP",{
                    service : "Gmail",
                    auth : {
                        user : "soporte@pixvector.mx",
                        pass : "Soporte#18"
                    }
                });
                var mailobject = {
                    from : "Soporte Pixvecto <soporte@pixvector.mx>",
                    to : "lucio.ivanhoe@gmail.com;alfredo@pixvector.com.mx",
                    subject : "Adjunto #6",
                    html : "<H1>Sorpresa<H1><p>Ejemplo de correo con <b>formato</b></p><a href='www.google.com'>Ir al link</a>",
                    attachments: [
                    {
                        filename : '2015-03-18.jpg',
                        contents : data
                    }]
                };

                transport.sendMail(mailobject,function(error, response){
                    if (!error) {
                        console.log("++Correo enviado++:"+response.message);
                    }else{
                        console.log("++Error++:"+error);
                    }
                });
            };
        });
    }
    else{
        console.log("No Existe");
    }
});