var express = require('express');

var Users = require("../database/users");
var Cliente = require("../database/cliente");
var router = express.Router();
var jwt = require("jsonwebtoken");

//Registrar usuario
router.post('/user', (req, res) => {
    var params = req.body;
    var email = params.email;
    if(params.TipoUsuario != null){
        params["TipoUsuario"] = "Propietario del Restaurant";
        console.log("se registro al propietario de restaurant");
    }else{
        params["TipoUsuario"] = "cliente";
        console.log("se registro cliente");
    }
    
    Users.find({email: email}).exec( async(err, docs) => {
        if(docs != null){
            console.log("el email ya existe");
            res.status(200).json({
                msn: "el usuario ya existe"
            });
        }else{
            params["registerdate"] = new Date();
            var users = new USER(params);
            var result = await users.save();
            res.status(200).json(result);
            console.log('user saved');
        }
    });   
});

// GET Users
router.get('/user', (req, res) => {
    var params = req.query;
    var limit = 100;
    if (params.limit != null) {
        limit = parseInt(params.limit);
    } 
    var skip = 0;
    if (params.skip != null) {
        skip = parseInt(params.skip);
    }
    Users.find({}).limit(limit).skip(skip).exec((err, docs) => {
        res.status(200).json(docs);
    console.log('mostrando users');
    });
});

// DELETE User 
router.delete("/user", async(req,res) => {
    var id = req.query.id;
    console.log(req.query.id);
    if (id == null) {
      res.status(300).json({
        msn: "introducir id"    
      });
      return;
    }
    var result = await Users.remove({_id: id});
    res.status(200).json(result);
    console.log('user deleted');
  });

//LOGIN
router.post('/login', async(req, res, next)=>{
    var params = req.body;
    Users.find({email:params.email, password:params.password}).exec((err, docs)=>{
        if (err){
            res.status(300).json({
                "msn": "Problemas con la base de datos"
            });
            return;
        }
        if (docs.length == 0){
            res.status(300).json({
                "msn": "Usuario y/o Password Incorrecto"
            });
            return;
        } else {
            //cracion del token
            jwt.sign({name: params.email, password: params.password}, "password", (err, token)=>{
                if(err){
                    res.status(300).json({
                        "msn": "Error con JSONWEBTOKEN"
                    });
                    return;
                }
                res.status(200).json({
                    tipo:docs.tipo,
                    "token": token
                });
                return;
            });
        }
    });
});




module.exports = router
