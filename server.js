var express= require("express");
var bodyParser=require("body-parser");
var {FB} = require("adathink-sdk-bot");



var app = express()



//Interatua y peticiones del formato

app.use(bodyParser.json());

var config = {
	token: "EAAG4yjZBJ5ZBwBAOGlTaH2YcT7CRBc6Y8L3CBBdc9swlSUhErxJAZCBSOWgx0dAlrzIBB1yQJcBAesr6UcjupN2fzH6dTGglWsBKlHNq8KcgpzNpFGXrgu4ZAfnNFZCygzcRajcyZCpfi22PROTrrkn0ZBZCPBeuDtZBiAwWjdJinOGiBDRz9IxmZC",
	key:"demoSophyBot"
}

FB.setConfig(config);

//enlazar fb con tu servidor

app.get("/",FB.checkWebhook);

//Aqui va llegan los mensajes

app.post("/",function(req,res){
	res.sendStatus(200);
	console.log("Llego un nuevo mensaje")
	let FBTools=new FB(req.body);

	FBTools.getInfo(function (e) {
		var mensaje = FBTools.getMessage();
                 console.log(e);
                
                if (mensaje=="hola") {
                	                let quick={
        "title":"Hola " + e.first_name +" ¿Que te gustaria hacer?",
        "replies":[{"title":"arroz con pollo","payload":"id"},
        {"title":"Ceviche","payload":"id"},
        {"title":"causa","payload":"id"}]}

		FBTools.quickReplies(quick);  //encuenta
                }
                if (mensaje=="arroz con pollo") {
                	FBTools.sendImage("http://www.ajinomoto.com.pe/repositorioaps/data/1/1/1/rec/28arrozconpollo/images/28.-Arroz-con-pollo1.jpg");
                }
				if (mensaje=="Ceviche") {
                	FBTools.sendImage("https://t2.rg.ltmcdn.com/es/images/7/4/1/img_ceviche_peruano_18147_600.jpg");
                }
                if (mensaje=="causa") {
                	FBTools.sendImage("http://www.ajinomoto.com.pe/repositorioaps/data/1/1/1/rec/124causa-de-pollo/images/124.%20Causa-de-pollo.jpg");
                }

            })


	})

	

	  

//Puerto de ejecucion 
app.listen(3000,function(){
	console.log("tu servidor esta ejecutando en el puerto ------> 3000")
})