// Se agrega este código para poder llamar este archivo
// usando el método require...  (require("modulo"));
if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define(
[
    "express",
],
function
(
    express
){

    var apiRouter = express.Router();

    apiRouter.use("/", function(req, res, next){
       res.render("app/portal/index");
    });


    return apiRouter;

});
