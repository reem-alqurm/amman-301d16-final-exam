'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT ;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended : true}));
// Specify a directory for static resources
app.use(express.static('public'));
// define our method-override reference
app.use(methodOverride('_method'));
// Set the view engine for server-side templating
app.set('view engine', 'ejs');
// Use app cors
app.use(cors());

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', handelHomepage);
app.post('/favorite-quotes',saveChar);
app.get('/favorite-quotes', showAllsaved);
app.get('/favorite-quotes/:id', viewDetiles);
app.put('/favorite-quotes/:id', updatdetiles);
app.delete('/favorite-quotes/:id', deletedetiles);

// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function handelHomepage (request , response ){
    const url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10';

    superagent.get(url).set('User-Agent', '1.0').then(data =>{
        const tenqouts= data.body.map(value=> new Simpsons(value));
            response.render('index', {qouts : tenqouts});
    })
        
   
    
}
function saveChar(request , response ){
    const {character, image,quote} = request.body;
    const sql ='INSERT INTO character (character, image,quote)VALUES ($1 , $2, $3);'
    const safvalues = [character, image,quote];
    client.query(sql,safvalues).then(()=>{
        response.redirect('favorite-quotes');
    })
}
function showAllsaved(request , response ){
    const sql ='SELECT * FROM character';
    client.query(sql).then(data =>{
        response.render('favorite-quotes', {saved : data.rows});
    })
}

function viewDetiles(request,response){
    const id = request.params.id;
    const sql = 'SELECT * FROM character WHERE id=$1;'
    const safvalue = [id];
    client.query(sql,safvalue).then(data=>{
        response.render('viewdetiles',{saved : data.rows});
    })
}
function updatdetiles(request,response){
    const id = request.params.id;
    const {quote} = request.body;
    const sql = 'UPDATE character SET quote=$1 WHERE id=$2;'
    const safevalus= [quote,id];
    client.query(sql,safevalus).then(()=>{
        response.redirect(`/favorite-quotes/${id}`);
    })
}
function deletedetiles(request,response){
    const id = request.params.id;
    const sql = 'DELETE FROM character WHERE id=$1';
    const safevalus= [id];
    client.query(sql,safevalus).then(()=>{
        response.redirect('/favorite-quotes');
    })
}

// helper functions
function Simpsons(data){

    this.quote = data.quote;
    this.character= data.character;
    this.image= data.image;
    this.characterDirection= data.characterDirection;
}
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
