const express = require('express');
const path = require('path');
const {PORT}  = require('./config');
require('dotenv').config();

//DB config


require('./database/config').dbConnection();


// App de Express
const app = express();


const server = require('http').createServer(app);


//Lectura y parseo del body

app.use(express.json());



// Path público
const publicPath = path.resolve( __dirname, 'public' );
app.use( express.static( publicPath ) );


//RUTAS

app.use('/api/login',require('./routes/auth'));

app.use('/api/orders', require('./routes/auth_orders'));

app.use('/api/client', require('./routes/auth_clients'));

server.listen( PORT, ( err ) => {

    if ( err ) throw new Error(err);


});



