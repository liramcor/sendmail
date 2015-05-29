require(
[
    "jquery",
    "fileupload"
],
function(
		$,
		fileupload
		){
	var formupload = $("#formupload");
	var mstrClave = "";
	$("#btnCargar").click(function(){
		
		var data = {
			nombre : $("#txtNombre").val(),
			descripcion : $("#txtDesc").val(),
			correo : $("#txtCorreo").val(),
			clave : mstrClave
		};

		$.ajax({
			method: "POST",
			url: "/data",
			data: data,
			success : function(result){
				if (!result.err) {
					$("#iu-button").hide();
				};
			}
		})
	});

	$(document).ready(function(){
		$("form").on("submit",function(e){
			e.preventDefault();
		});
	});

	$("#uploadfile").fileupload({
		    url: '/upload',
		    add:function(e, data){
		    	if (data.originalFiles[0]['size'] && 
		    		data.originalFiles[0]['size'] > 18874368) {
		    		alert('El archivo es demasiado grande');
		    	}
		    	else{
		    		$("#iu-progress").css("visibility","visible");
		    		$("#iu-progress").css("height","auto");
		    		data.submit();
		    	}
		    },
		    done: function (e, data) {
		    	if (data.result.error) {
		    		//aler('Error: '+data.result.error);
		    		$("#iu-error").css("visibility","visible");
		    		$("#iu-error").css("height","auto");
		    	}
		    	else{
		    		mstrClave=data.result.file;
		    		$("#iu-message").css("visibility","visible");
		    		$("#iu-button").css("visibility","visible");
		    		$("#iu-file").css("visibility","hidden");
		    		$("#iu-file").css("height","0px");
		    		$("#iu-message").css("height","auto");
		    		$("#iu-progress").css("visibility","hidden");
		    		$("#iu-progress").css("height","0px");
		    	}
		    },
		    progressall: function(e,data){
		    	var progress = parseInt(data.loaded / data.total * 100, 10);
		    	$("#iu-progressbar").css("width",progress);
		    }
	});
});