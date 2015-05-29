// Se agrega este código para poder llamar este archivo
// usando el método require...  (require("modulo"));
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define(
[
    "express",
    "fs",
    "libs/fileUploader",
    "node-uuid",
    "nodemailer"
],
function
(
    express,
    fs,
    fileUploader,
    uuid,
    nodemailer
){

    var apiRouter = express.Router();

    apiRouter.route("/")
    .get(function(req, res){
       res.render("app/portal/comunicados/comunicado");
    });

    apiRouter.route("/upload")
    .post(function(req, res){

        fileUploader.setOptions({
                maxFileSize: 1000000000,
                storage: {
                    type: "local"
                }
            });
        fileUploader.post(req)
            .then(function(result){
                var lstrID = uuid.v4();
                fileName = result.fileName;
                filePath = result.filePath;
                console.log("fileName:"+fileName);
                console.log("filePath:"+filePath);
                fs.rename(filePath, filePath.replace(fileName,lstrID+".zip"), function(err){
                    if (err){
                        res.status(403).json({ error: err });
                    }else{
                        res.status(200).json({ file: lstrID });
                    }
                });
            });
    });

    apiRouter.route("/data")
    .post(function(req, res){
        console.log(req.body);
        var mails = ["lucio@pixvector.mx","lucio.ivanhoe@gmail.com"];
        var templateMail = "<b>Comunicado</b><br/> \
                    <p>Nombre:<b>@Nombre</b></p> \
                    <p>Descripción:<b>@Descripcion</b></p> \
                    <p>Correo:<b>@Correo</b></p> \
                    <p>Clave:<b>@Clave</b></p>";
        var file = {
            name : req.body.clave+".zip",
            path : "./uploads/files/"+req.body.clave+".zip"
        };
        
        var body = templateMail.replace("@Nombre",req.body.nombre);
        body = body.replace("@Descripcion",req.body.descripcion);
        body = body.replace("@Correo",req.body.correo);
        body = body.replace("@Clave",req.body.clave);

        var optionsMail = {
            subject : "Nuevo Comunicado",
            file : file,
            mails : mails,
            body : body
        };

        sendMail(optionsMail,function(err){
            if (err) {
                res.json({ err: err});
            }else{
                optionsMail = {
                    subject : "Alta de nuevo comunicado",
                    mails : [req.body.correo],
                    body : body
                };
                sendMail(optionsMail, function(err){
                    if (err) {
                        res.json({err:err});
                    }else{
                        res.json({message : "Correcto"});
                    }
                });
            }
        });
    });

    var sendMail = function(options, callback)
    {
        console.log("Enviando Correo: "+options);
        var transport = nodemailer.createTransport("SMTP",{
            service : "Gmail",
            auth : {
                user : "soporte@pixvector.mx",
                pass : "Soporte#18"
            }
        });
        
        if (options.file) {
            if (fs.existsSync(options.file.path)) {
                fs.readFile(options.file.path, function(err,data){
                    if (!err) {
                        var mailobject = {
                            from : "Soporte Pixvecto <soporte@pixvector.mx>",
                            to : options.mails.join(";"),
                            subject : options.subject,
                            html : options.body,
                            attachments: [{
                                filename : options.file.name,
                                contents : data
                            }]
                        };

                        transport.sendMail(mailobject,function(error, response){
                            if (error) {
                                console.log("Error al mandar mail:");
                                console.log(error)
                                callback({ err: error});
                            }else{
                                console.log("Correo enviado correctamente");
                                callback();
                            }
                        });
                    }
                    else
                    {
                        console.log("Ocurrio error:");
                        console.log(err);
                    }
                });
            }else{
                console.log("No existe el archivo:"+options.file.path);
            }           
        }
        else{
            console.log("No tiene archivo");
            var mailobject = {
                from : "Soporte Pixvecto <soporte@pixvector.mx>",
                to : options.mails.join(";"),
                subject : options.subject,
                html : options.body,
            };

            transport.sendMail(mailobject,function(error, response){
                if (error) {
                    console.log("Error al mandar mail:");
                    console.log(error)
                    callback({ err: error});
                }else{
                    console.log("Correo enviado correctamente");
                    callback();
                }
            });
        }
    }

    return apiRouter;
});
