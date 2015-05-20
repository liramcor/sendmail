require(
[
    "jquery",
    "io"
],
function($, io){

    var socket = io("http://localhost:3000");

    socket.on("greeting", function(data){
        console.log("Saludo recibo!");
        console.log("Enviando saludo...");
        socket.emit("greeting", { greeting: "Frontend" });
    });

});
