// Importando las librerias
var express = require("express");
var bodyParser = require("body-parser");
var { FB } = require("adathink-sdk-bot");
const mongoDB = require("./model/SophyDB")
const DIALOGFLOW = require("./test")
const SophyDB = new mongoDB()
const config = require("./config.js")

// Instanciando express
var app = express()


// Instanciando DialogFlow
const DF = new DIALOGFLOW()

//Configuracion
app.use(bodyParser.json());

FB.setConfig(config["AdaThinkLab"]);

//enlazar fb con tu servidor

app.get("/", FB.checkWebhook);

//Aqui va llegan los mensajes
app.post("/", async function (req, res) {

	res.sendStatus(200)
	let FBTools = new FB(req.body);


	// console.log(FBTools.getLocation())
	const { entities, data } = await DF.processText("1", FBTools.getMessage())
	console.log( entities)
	const intent = data.action
	console.log(intent)
	switch (intent) {
		case "PedirDistrito": Distrito(FBTools, entities); break;
		case "PedirCiudadDistrito": DistritoDepartamento(FBTools, entities); break;
		case "GPS ON":askLocation(FBTools) ; break;
		case "PedirDepartamentos": Departamento(FBTools, entities); break;
		default: FBTools.sendMessage(data.message[0].valor)
	}
})

// Funcion para cosnulta a la base de datos
function Distrito(FBTools, entities) {
	SophyDB.connect(async (client) => {
		const places = await SophyDB.selectAllPlaceDistrito(capitalize(entities.distritos))
		let arrayCarrusel = []
		places.forEach(place => {
			const card = {
				"title": place.nombre,
				"image_url": place.fotos[0].foto,
				"subtitle": place.horario + ". " + place.precio,
				"buttons": [{
					"type": "phone_number",
					"title": "Contactar",
					"payload": place.contacto
				}
				]
			}
			arrayCarrusel.push(card)
		})
		FBTools.sendCarrusel(arrayCarrusel);
	})
}

function Departamento(FBTools, entities) {
	SophyDB.connect(async (client) => {
		const places = await SophyDB.selectAllPlaceProvincia(capitalize(entities.Departamento))
		let arrayCarrusel = []
		places.forEach(place => {
			const card = {
				"title": place.nombre,
				"image_url": place.fotos[0].foto,
				"subtitle": place.horario + ". " + place.precio,
				"buttons": [{
					"type": "phone_number",
					"title": "Contactar",
					"payload": place.contacto
				}
				]
			}
			arrayCarrusel.push(card)
		})
		FBTools.sendCarrusel(arrayCarrusel);
	})
}

function DistritoDepartamento(FBTools, entities) {
	SophyDB.connect(async (client) => {
		const places = await SophyDB.selectAllPlaceDistritoProvincia(capitalize(entities.Departamento),capitalize(entities.distritos))
		let arrayCarrusel = []
		places.forEach(place => {
			const card = {
				"title": place.nombre,
				"image_url": place.fotos[0].foto,
				"subtitle": place.horario + ". " + place.precio,
				"buttons": [{
					"type": "phone_number",
					"title": "Contactar",
					"payload": place.contacto
				}
				]
			}
			arrayCarrusel.push(card)
		})
		FBTools.sendCarrusel(arrayCarrusel);
	})
}

// Funcion para solicitar GPS
function askLocation(FBTools) {
	let quick = {
		"title": "location",
		"replies": [{
			"title":"location"
		  }]
	}
	FBTools.quickReplies(quick);
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


//Puerto de ejecucion 
app.listen(3000, function () {
	console.log("tu servidor esta ejecutando en el puerto ------> 3000")
})

