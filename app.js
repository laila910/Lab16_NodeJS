const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const app = express();

let contacts=[];
let contactIndex=0;
LoadDatafromFile();
 
 function LoadDatafromFile(){
    fs.readFile("db.txt",function(err,data){
          contacts=JSON.parse(data);
          let maxId=0;
          for(let contact of contacts){
            if(contact && contact.id > maxId) maxId = contact.id;
          }
          maxId++;
          contactIndex=maxId;
    });
 }
//  let contactIndex=contacts.length;

 function saveTofile(){
    fs.writeFile("db.txt",JSON.stringify(contacts),function(){});
 }
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// show all contacts (Read) (home Page)
app.get("/",function(req,res){
    if(req.query.name==undefined) req.query.name=""; 

   let html=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
      <!-- CSS only -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <div class="input-group">  
            <div class="col-md-12">
            <form action="/" method="get">
                <label for="inputSearch" class="form-label"></label>
                <input type="text" name="name" value="${req.query.name}" class="form-control" id="inputSearch" placeholder="search">
                <input class="btn btn-primary text-white" type="submit" value="search">
            </form>
            </div>
          </div>
    </div>
    <div class="container">
      <div class="col-12 mt-3 mb-3">
        <a  class="btn btn-primary text-white" href="addContactPage">Add Contact</a>
      </div> 
    </div>`;

let filterContacts=contacts.filter(contact=>contact && contact.name.toLowerCase().indexOf(req.query.name.toLowerCase())>-1);

let contactsTrs=filterContacts.map(contact=>{
  return ` <tr>
  <th scope="row">${contact.id}</th>
  <td>${contact.name}</td>
  <td>${contact.email}</td>
  <td>${contact.address}</td>
  <td>${contact.phone}</td>
  <td><form method="get" action="editContact">
      <input type="hidden" name="id" value="${contact.id}">
       <input type="submit" value="edit" class="btn btn-warning mx-5 text-white ">
       </form>
       
       <form method="get" action="deleteContact">
            <input type="hidden" name="id" value="${contact.id}">
          <input type="submit" value="delete" class="btn btn-danger mx-5 text-white">
            </form>
    </td>
</tr>`;
});

html +=`  <div class="container">
<table class="table">
    <thead class="thead-dark">
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Address</th>
        <th scope="col">Phone</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody> ${contactsTrs.join("")}</tbody>
    </table>
</div>

<!-- JavaScript Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>     

</body>
</html>`;

res.send(html);
});

// add contact 
app.get("/addContactPage",function(req,res){
 res.sendFile(__dirname+"/views/addContact.html");
});

// get Data from form :)
app.post("/addContact",function(req,res){
    req.body.id=contactIndex++;
    contacts.push(req.body);
    saveTofile();
    console.log(contacts);
    // res.sendFile(__dirname+"/views/home.html");
   res.send(`<!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Home Page</title>
         <!-- CSS only -->
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
   </head>
   <body><div class="container"><h1>Contact added </h1> <a href="/" class="btn btn-primary text-white">return to Home</a></div><!-- JavaScript Bundle with Popper -->
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>     
        
   </body>
   </html>`);
});

// Update
app.get("/editContact",function(req,res){
    let contact=contacts.find(contact=>contact && contact.id==req.query.id);
 
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Add Contact</title>
          <!-- CSS only -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
  </head>
  <body>
      <div class="container mt-5">
          <form  action="editContact"  method="post" class="row g-3">
          <input type="hidden" name="id" value="${contact.id}">
              <div class="col-md-12">
                  <label for="inputName" class="form-label">Name</label>
                  <input type="name" class="form-control" id="inputName" name="name" value="${contact.name}">
              </div>
              <div class="col-md-12">
                <label for="inputEmail4" class="form-label">Email</label>
                <input type="email" class="form-control" id="inputEmail4" name="email" value="${contact.email}">
              </div>
              <div class="col-12">
                <label for="inputAddress" class="form-label">Address</label>
                <input type="text" class="form-control" id="inputAddress" name="address" value="${contact.address}">
              </div>
              <div class="col-12">
                <label for="inputPhone" class="form-label">Phone</label>
                <input type="text" class="form-control" id="inputPhone" name="phone" value="${contact.phone}">
              </div>
             
              <div class="col-12">
                <button type="submit" class="btn btn-primary">edit Contact</button>
              </div>
            </form>
      </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>     
  </body>
  </html>`);
  
  });

app.post("/editContact",function(req,res){
    let contact=contacts.find(contact=>contact && contact.id==req.body.id);
    contact.name=req.body.name;
    contact.email=req.body.email;
    contact.address=req.body.address;
    contact.phone=req.body.phone;
    saveTofile();
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home Page</title>
          <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    </head>
    <body><div class="container"><h1>Successful edit contact </h1> <a href="/" class="btn btn-primary text-white">return to Home</a></div><!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>     
         
    </body>
    </html>`);
});
// Delete
app.get("/deleteContact",function(req,res){
  let contactIndex=contacts.findIndex(contact=>contact && contact.id==req.query.id);
//   contacts=contacts.splice(contactIndex,1);
delete contacts[contactIndex];
saveTofile();
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
      <!-- CSS only -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
</head>
<body><div class="container"><h1>Successful Delete  contact </h1> <a href="/" class="btn btn-primary text-white">return to Home</a></div><!-- JavaScript Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>     
     
</body>
</html>`);

});


app.listen(8080);