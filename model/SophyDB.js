const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://SophyDB:SophyDB@sophydb-5atvq.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log(err)
  client.close();
});
