const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const mongo = require('./controllers/Mongo');
const routes = require('./controllers/routes');

const app = express();
//app.set('view engine', 'ejs'); //set default templating engine
app.use('/assets', express.static('assets'));//to serve static routes

mongo(mongoose); //Connects to Mongo

//Book Schema
const BookSchema = new mongoose.Schema({
	title: String,
	author: String,
	photo: String,
})

const Book = mongoose.model('Book', BookSchema);

routes(app, fs, Book, path); //Basic Navigation

// listen to port 3000
app.listen(3000, () =>{
	console.log("Listening to port 3000");
})
