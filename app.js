const express=require('express');
const bodyParser=require('body-parser');
const app = express();
 var contacts=[];
// use body-parser

app.use(bodyParser.urlencoded({extended:true}));


app.use(bodyParser.json());

// show all contacts (Read)
app.get("/",function(req,res){
 res.sendFile(__dirname+"/views/home.html");

});

// add contact 
app.get("/addContactPage",function(req,res){
 res.sendFile(__dirname+"/views/addContact.html");
});

// get Data from form :)
app.post("/addContact",function(req,res){
    // console.log(req.body);
    console.log(req.body);
    contacts.push(req.body);
    res.send('successful add contact');
});

// Update


// Delete



app.listen(8080);