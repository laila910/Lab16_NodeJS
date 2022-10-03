const express = require('express');
const bodyParser=require('body-parser');
const fs =require('fs');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',function(req,res){
   res.sendFile(__dirname+"/views/home.html");
});


app.listen(8080);