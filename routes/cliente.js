var express = require('express');
var router = express.Router();
var Cliente  = require("../database/cliente");

//POST
router.post("/cliente",  (req, res) => {
  var datos=req.body;
  var obj={};
  obj["nombre"]=datos.nombre;
  obj["ci"]=datos.ci;
  obj["telefono"]=datos.telefono;
  obj["email"]=datos.email;
  obj["password"]=datos.password;
  //obj["tipo"]=datos.tipo;
  var guardando=new Cliente(obj);  
  guardando.save().then(() => {  
    res.status(200).json({"mns" : "Cliente Registrado"});
  });
 });

//GET
router.get("/cliente",(req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  Cliente.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.json({
      result : docs
    });
  });
});

//PUT
router.put("/cliente", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["nombre","telefono","email","tipo"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    Cliente.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
       res.status(200).json(docs);
       return;
    });
});


//DELETE
router.delete("/cliente", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    Cliente.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});

module.exports = router

