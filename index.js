const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = 6288


var serviceAccount = require("al-arab-1-firebase-adminsdk-h09i9-5667336c52.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mojnu:ineedjob@cluster0.jvd1e.mongodb.net/burj-al-arab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingsCollection = client.db("burj-al-arab").collection("booking");
  
  app.post('/booking', (req, res) => {
      const newBooking = req.body;
      bookingsCollection.insertOne(newBooking)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
      console.log(newBooking)
  })

  app.get('/booking', (req, res) => {
    console.log(req.headers.authorization)
    bookingsCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)