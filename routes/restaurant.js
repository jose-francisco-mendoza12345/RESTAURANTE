var express = require('express');
var router = express.Router();
var USER  = require("../database/restaurant");

/* GET */
router.get('/restaurant',(req, res, next) => {
  USER.find({}, (err, docs) => {
    res.status(200).json(docs);
  });
});


//POST
 router.post("/restaurant", (req, res) => {
  var datos=req.body;

  var user={};
  user["nombre"]=datos.nombre;
  user["nit"]=datos.nit;
  user["propietario"]=datos.propietario;
  user["calle"]=datos.calle;
  user["telefono"]=datos.telefono;
  var guardando=new USER(user);  //-->variable para guardar en la base de datos
  guardando.save().then(() => {  //-->guardando
    res.status(200).json({msn: "Usuario Registrado"});
  });
 });

 router.put("/restaurant",async(req, res) => {
  var params = req.query;
  var bodydata = req.body;
  if(params.id == null){
    res.status(300).json({msn:"El id es necesario "});
    return;
  }
  var allowkeylist = ["nombre", "nit", "calle" , "telefono"]
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
 router.delete("/restaurant", (req, res) => {
  var params = req.query;
  if(params,id == null){
    res.status(300).json({msn: "el id es necesario"});
    return; 
  }
  USER.remove({_id: params.id}, (err, docs)=> {
  if(err){
  res.status(500).json({msn: "existe problemas en la base de datos"});
    return; 
   }   
  res.status(200).json(docs);
     });
 });


 //PATCH  --->falta <-------
 router.patch("/restaurant", (req, res) => {

 });
module.exports = router