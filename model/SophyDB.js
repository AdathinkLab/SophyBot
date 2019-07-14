// Importando libreria de mongo DB
const mongodb = require('mongodb');
const config = require("./../config.js")
//Clase para manejar la conexion y consultas a la DB
class MongoDB {
  constructor() {
    // Datos de conexión con la base de datos
    this.URL = config["MongoDB"]["url"]
    this.DB = config["MongoDB"]["nameDB"]
    this.COLLECTION_PLACE = config["MongoDB"]["collectionPlace"]
  }
  // Funcion para conectar 
  connect(callback) {
    let _this = this
    // Conectando a la DB
    mongodb.MongoClient.connect(this.URL, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        console.log("Error Conexion", err);
        callback(err, null);
      } else {
        console.log("Conexion exitosa BD MONGO")
        _this.client = client
        callback(err, client);
      }
    })
  }
  // Funcion para obtener un Patrimonio Cultural
  selectPlace() {
    let _this = this
    return new Promise((resolve, reject) => {
      let db = this.client.db(_this.DB);
      let collection = db.collection(_this.COLLECTION_PLACE);
      collection.findOne({}, (err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  // Funcion para insertar Patrimonios Culturales
  insertPlace(data) {
    let _this = this
    return new Promise((resolve, reject) => {
      let db = this.client.db(_this.DB);
      let collection = db.collection(_this.COLLECTION_PLACE);
      collection.insertOne(data, (err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  // Funcion para obtener todos los patrimonios culturales
  selectAllPlace() {
    let _this = this
    return new Promise((resolve, reject) => {
      let db = _this.client.db(_this.DB);
      let collection = db.collection(_this.COLLECTION_PLACE);
      collection.find({}).toArray((err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  selectAllPlaceProvincia(ciudad) {
    let _this = this
    return new Promise((resolve, reject) => {
      let db = _this.client.db(_this.DB);
      let collection = db.collection(_this.COLLECTION_PLACE);
      collection.find({ciudad:ciudad}).toArray((err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  selectAllPlaceDistrito(distrito) {
    let _this = this
    return new Promise((resolve, reject) => {
      let db = _this.client.db(_this.DB);
      let collection = db.collection(_this.COLLECTION_PLACE);
      collection.find({distrito:distrito}).toArray((err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  selectAllPlaceDistritoProvincia(distrito,ciudad) {
    let _this = this
    return new Promise((resolve, reject) => {
      let db = _this.client.db(_this.DB);
      let collection = db.collection(_this.COLLECTION_PLACE);
      collection.find({ciudad:ciudad,distrito:distrito}).toArray((err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  // Funcion para cerrar la conexión
  closeConnection(){
    this.client.close()
    console.log("Conexion")
  }
}

 module.exports = MongoDB

// let mongo = new MongoDB()

// async function x (client){

//   let places = await mongo.selectAllPlaceDistrito("Miraflores")
//   console.log(places)
// }

// mongo.connect(x)
