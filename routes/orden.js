var express = require('express');
var router = express.Router();
var Orden  = require("../database/orden");

//GET 
router.get("/orden", (req, res, next) =>{
  Orden.find({}).populate("menus").populate("restaurant").populate("cliente").exec((error, docs) => {
    res.status(200).json(docs);
  });
});

//POST
router.post("/orden",  (req, res) => {
  var datos=req.body;
  var obj={};
  obj["menus"]=datos.menus;
  obj["restaurant"]=datos.restaurant;
  obj["cantidad"]=datos.cantidad;
  obj["cliente"]=datos.cliente;
  obj["precio"]=datos.precio;
  obj["pagototal"]=datos.pagototal;
  var guardando=new Orden(obj);  
  guardando.save().then(() => {  
    res.status(200).json({"mns" : "Orden Registrado"});
  });
 });
//PUT
router.put("/orden", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["precio","cantidad"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    Orden.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
       res.status(200).json(docs);
       return;
    });
});
//DELETE
router.delete("/orden", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    Orden.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
 module.exports = router;

 
