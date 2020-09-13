var express = require('express');
var router = express.Router();
var USER  = require("../database/orden");

/* GET */
router.get('/ordenes',(req, res, next) => {
  USER.find({}, (err, docs) => {
    res.status(200).json(docs);
  });
});


//POST
 router.post("/ordenes", (req, res) => {
  var datos=req.body;

  var user={};
  user["cantidad"]=datos.cantidad;
  user["lugardeenvio"]=datos.lugardeenvio;
  var guardando=new USER(user);  //-->variable para guardar en la base de datos
  guardando.save().then(() => {  //-->guardando
    res.status(200).json({"mns" : "Usuario Registrado"});
  });
 });

 //UPDATE  ---> falta   <-------
 router.put("/ordenes", async(req, res) => {
  var params = req.query;
  var bodydata = req.body;
  if(params.id == null){
    res.status(300).json({msn:"El id es necesario "});
    return;
  }
  var allowkeylist = ["cantidad","lugardeenvio"]
  var keys = Object.keys(bodydata);
  var updateobjectdata ={};
  for(var i=0; i<keys.length; i++){
  if(allowkeylist.indexOf(keys[1]> -1)){
    updateobjectdata[keys[i]] = bodydata[keys[i]];
   }
  }
    USER.update({ _id: params.id}, {$set: bodydata},  (err, docs)=> {
    if(err){
      res.status(500).json({msn: "existen problemas en la base de datos"});
      return;
    }
    res.status(200).json(docs);
   });  

 });


 //DELETE  --->falta     <-------solo es un ejemplo
 router.delete("/ordenes", (req, res) => {
  var datos=req.body;
  var name = datos.id;
  console.log(datos);
  console.log(name);
  res.status(200).json({
    mns:"DELETE"
  });
 });

 module.exports = router;

 