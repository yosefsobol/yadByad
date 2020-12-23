console.log("app is loading");
const express = require("express");
const mongoex =require("./mongodb_ex"); 
const app = express();
const jwtVerifier = require('express-jwt')
const secret = '1234(=:'
const utils = require("./production_utils");
const fs = require('fs');
app.use(express.json({limit: '50mb'}));
const path = require("path");
const multer = require("multer");
const uploadDirectory = "uploads/";
const upload = multer({ dest: uploadDirectory });

app.post("/addFiles", upload.single("File"), (req, res) => {
  console.log("/api is accessed");
  res.status(201).send({ body: req.body.FileName , File: req.file });
});

app.get("/images/:newFileName", (req, res) => {
  console.log("/images/:newFileName is accessed");

  const fullPathFileName = path.join(
    __dirname,
    uploadDirectory,
    req.params.newFileName
  );
  res.sendFile(fullPathFileName);
});
 
app.delete("/delete/:FileName" , (req, res) => {
  console.log("/del is accessed");
  FileName = req.params.FileName;
  console.log(FileName)
  fs.unlink(`C:/Users/DELL/Desktop/new/פןרייקט סופי/ExpressAndReactSimple-master/server/uploads/${FileName}`, (err) => {
    if (err)  {}
    else {
      res.status(200).send({ Status: "Success"});
    }
    })
  })
// *********************************************************
app.post("/users/register", jwtVerifier({secret:secret}), (req, res) => {
  console.log("/users/register root is accessed");
          mongoex.register(req, res)
});

app.post("/users/login", (req, res) => {
  console.log("/users/login root is accessed");
          mongoex.login(req, res)
});

// *********************************************
app.post('/GetCities',(req,res)=>{
  mongoex.GetCities( req , res)
})

app.post('/GetFirstCities',(req,res)=>{
  mongoex.GetFirstCities( req , res)
})

app.put('/Cities/:id' , (req , res)=>{
  mongoex.updateCities( req , res)
})
// **********************************************
app.post('/GetStates',(req,res)=>{
  mongoex.GetStates( req , res)
})

app.post('/GetFirstStates',(req,res)=>{
  mongoex.GetFirstStates( req , res)
})
// **********************************************

app.get('/Holiday' , (req , res)=>{
  mongoex.getHoliday( req , res)
})

app.get('/LastHoliday' , (req , res)=>{
  mongoex.LastHoliday ( req , res)
})

app.post('/Holiday' ,jwtVerifier({secret:secret}), (req , res)=>{
  mongoex.postHoliday( req , res)
})

app.post('/find/',jwtVerifier({secret:secret}),(req,res)=>{
  mongoex.Find( req , res)
})
app.put('/people/:id' ,jwtVerifier({secret:secret}), (req , res)=>{
  mongoex.updatePeople( req , res)
})

app.get('/people/:id' ,jwtVerifier({secret:secret}), (req , res)=>{
  mongoex.getPeople( req , res)
})

app.post('/people' ,jwtVerifier({secret:secret}), (req , res)=>{
  mongoex.postPeople( req , res)
})
// ***************************************** נסיון
app.get('/people1' ,jwtVerifier({secret:secret}), (req , res)=>{
  mongoex.getPeople1( req , res)
})

app.post('/FindWlimit/:num', jwtVerifier({secret:secret}), (req,res)=>{
  mongoex.FindWlimit( req , res)
})

utils.handleProduction(express, app);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});