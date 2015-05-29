// Se agrega este código para poder llamar este archivo
// usando el método require...  (require("modulo"));
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define("libs/fileUploader",
[
    "aws-sdk",
    "fs",
    "q",
    "formidable"
],
function
(
    aws,
    fs,
    Q,
    formidable
){

    var FileUploader = function(){
        var options = {
            newName: "",
            uploadDir: "./uploads/files",
            minFileSize: 1,
            maxFileSize: 1000000,
            acceptFilesTypes: /.+/i,
            inlineFileTypes: /\.(gif|jpe?g|png)/i,
            imageTypes: /\.(gif|jpe?g|png)/i,
            storage: {
                type: "local",
                accessKeyId: null,
                secretAccessKey: null,
                bucketName: null,
                bucketFolder: "",
                region: "us-east-1",
                acl: "public-read"
            }
        };

        var configurateAWS = function(){
            if(options.storage.accessKeyId && options.storage.secretAccessKey && options.storage.bucketName){
                aws.config.update({
                    accessKeyId: options.storage.accessKeyId,
                    secretAccessKey: options.storage.secretAccessKey
                });

                var s3 = new aws.S3({
                    computeChecksums: true
                });

                return s3;
            }
            else {
                return {
                    error: "Please enter valid AWS S3 details"
                };
            }
        };

        var getExt = function(filename){
            return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
        };

        var getContentTypeByFile = function(fileName) {
            var rc = "application/octet-stream";
            var fn = fileName.toLowerCase();

            if (fn.indexOf(".html") >= 0) rc = "text/html";
            else if (fn.indexOf(".css") >= 0) rc = "text/css";
            else if (fn.indexOf(".json") >= 0) rc = "application/json";
            else if (fn.indexOf(".js") >= 0) rc = "application/x-javascript";
            else if (fn.indexOf(".png") >= 0) rc = "image/png";
            else if (fn.indexOf(".jpg") >= 0) rc = "image/jpg";

            return rc;
        }

        return {
            setOptions: function(opts){
                options = {
                    newName: opts.newName || "",
                    uploadDir: opts.uploadDir || "./uploads/files",
                    minFileSize: opts.minFileSize || 1,
                    maxFileSize: opts.maxFileSize || 1000000,
                    acceptFilesTypes: opts.acceptFilesTypes || /.+/i,
                    inlineFileTypes: opts.inlineFileTypes || /\.(gif|jpe?g|png)/i,
                    imageTypes: opts.imageTypes || /\.(gif|jpe?g|png)/i,
                    storage: {
                        type: opts.storage.type || "local",
                        accessKeyId: opts.storage.accessKeyId || null,
                        secretAccessKey: opts.storage.secretAccessKey || null,
                        bucketName: opts.storage.bucketName || null,
                        bucketFolder: opts.storage.bucketFolder || "",
                        region: opts.storage.region || "us-east-1",
                        acl: opts.storage.acl || "public-read"
                    }
                };
            },

            delete: function(){
                var deferred = Q.defer();

                if(options.storage.type == "s3"){
                    var s3 = configurateAWS();

                    if(s3.error){
                        deferred.reject({ error: s3.error });
                    }

                    var params = {
                        Bucket: options.storage.bucketName,
                        Prefix: options.storage.bucketFolder
                    };

                    s3.listObjects(params, function(err, data) {
                        if (err){
                            deferred.reject(err);
                        }

                        params = {
                            Bucket: options.storage.bucketName
                        };

                        params.Delete = {};
                        params.Delete.Objects = [];

                        data.Contents.forEach(function(content) {
                            params.Delete.Objects.push({Key: content.Key});
                        });

                        s3.deleteObjects(params, function(err, data) {
                            if (err){
                                deferred.reject(err);
                            }

                            deferred.resolve(data.Deleted.length);
                        });
                    });
                }

                return deferred.promise;
            },

            post: function(req){
                var deferred = Q.defer();
                var form = new formidable.IncomingForm();

                form.uploadDir = options.uploadDir;

                form.parse(req, function(err, fields, file) {
                    // console.log(file.path, form.uploadDir, file.name);
                });

                form.on("error", function(err){
                    deferred.reject(err);
                });

                form.on("file", function(name, file){
                    if(file.size > options.maxFileSize){
                        fs.unlink(file.path);
                        deferred.reject({ error: "File is too big." });
                    }
                    else if(file.size < options.minFileSize){
                        fs.unlink(file.path);
                        deferred.reject({ error: "File is too small." });
                    }
                    else if(options.acceptFilesTypes.test(file.name) == false){
                        fs.unlink(file.path);
                        deferred.reject({ error: "Filetype not allowed." });
                    }
                    else {
                        var finalName = options.newName != "" ? options.newName + "." + getExt(file.name) : file.name;
                        var filePath = form.uploadDir + "/" + finalName;

                        fs.renameSync(file.path, filePath);

                        if(options.storage.type == "local"){

                            deferred.resolve({
                                fileName: finalName,
                                filePath: filePath
                            });
                        }
                        else if(options.storage.type == "s3") {
                            var s3 = configurateAWS();

                            if(s3.error){
                                deferred.reject({ error: s3.error });
                            }

                            var fileBuffer = fs.readFileSync(filePath);
                            var metaData = getContentTypeByFile(filePath);
                            var s3file = finalName;

                            if(options.newName != ""){
                                s3file = finalName;
                            }

                            if(options.storage.bucketFolder != ""){
                                s3file = options.storage.bucketFolder + "/" + s3file;
                            }

                            s3.putObject({
                                ACL: options.storage.acl,
                                Bucket: options.storage.bucketName,
                                Key: s3file,
                                Body: fileBuffer,
                                ContentType: metaData
                            }, function(err, res){
                                fs.unlink(filePath);

                                var url = s3.getSignedUrl("getObject", {
                                    Bucket: options.storage.bucketName,
                                    Key: s3file
                                });

                                if(err){
                                    deferred.reject({ error: err });
                                }

                                deferred.resolve({
                                    fileName: options.fileName,
                                    filePath: url
                                });
                            });

                        }
                    }
                });

                form.on("progress", function(bytesReceived, bytesExpected){
                    deferred.notify((bytesReceived / bytesExpected) * 100);
                });

                return deferred.promise;
            }
        }
    }

    return new FileUploader();
});