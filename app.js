require('dotenv').config();
const path = require('path');
const fs = require('fs')
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')
const serverless = require('serverless-http')


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())
// console.log('User:', process.env.MONGO_USER);
// console.log('Password:', process.env.MONGO_PASSWORD);
// console.log('URI:', process.env.MONGO_URI);
// const uri = 'mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@solar-system.gsn59.mongodb.net/solar-system?retryWrites=true&w=majority&appName=solar-system';
// console.log(uri)
const connectToMongo = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI,{
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASSWORD,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }) 
        console.log('Mongo connected')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo();

// mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
var Schema = mongoose.Schema;

var dataSchema = new Schema({
    _id: Object,
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('Planet', dataSchema, 'planets');

/*

app.post('/planet',   function(req, res) {
   // console.log("Received Planet ID " + req.body.id)
    planetModel.findOne({
        id: req.body.id
    }, function(err, planetData) {
        if (err) {
            alert("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9")
            res.send("Error in Planet Data")
        } else {
            res.send(planetData);
        }
    })
}) */

app.post('/planet', async function (req, res) {
    try {
        // Find the planet by ID
       // console.log(req.body.id)
        const planetData = await planetModel.findOne({ id: req.body.id });

        if (!planetData) {
            return res.status(404).send("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9");
        }

        res.send(planetData);
    } catch (err) {
        console.error("Error fetching planet data:", err);
        res.status(500).send("Error in Planet Data");
    }
});

app.get('/',   async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
    fs.readFile('oas.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
      } else {
        res.json(JSON.parse(data));
      }
    });
  });
  
app.get('/os',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.listen(3000, () => { console.log("Server successfully running on port - " +3000); })
module.exports = app;

//module.exports.handler = serverless(app)
