require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const app = express();

const routes = require('./routes');
const port = process.env.PORT;

app.use(express.json());
//Db Conn
const conn = require('./db/conn');
conn();

app.use(routes);
app.use(cors());

app.listen(port, () => console.log('running in port '+ port));