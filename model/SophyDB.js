const mongodb = require('mongodb');

class MongoDB {
  constructor() {
    this.URL = "mongodb+srv://SophyDB:SophyDB@sophydb-5atvq.mongodb.net/Sophy?retryWrites=true&w=majority"
    this.DB = "Sophy"
    this.COLLECTION_PLACE = "place"
  }
  connect(callback) {
    let _this = this
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

  selectAllPlace() {
    let _this = this
    return new Promise((resolve, reject) => {
      let db = this.client.db(_this.DB);
      let collection = db.collection(_this.COLLECTION_PLACE);
      collection.find({}).toArray((err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }


  closeConnection(){
    this.client.close()
    console.log("Conexion")
  }
}

module.exports = MongoDB