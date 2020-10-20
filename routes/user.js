var express = require("express");
var sha1 = require("sha1");
var USER = require("../database/users");
var Cliente  = require("../database/cliente");
var router = express.Router();
var jwt = require("jsonwebtoken");
var midleware = require("./midleware");

//LOGIN
//Propietario->Pedro@gmail.com->Pedro#123
//Cliente->Sam@gmail.com->Sam#123

router.post("/login", async(req, res) => {
    var body = req.body;
    if (body.email == null) {
        res.status(300).json({msn: "El email es necesario"});
             return;
    }
    if (body.password == null) {
        res.status(300).json({msn: "El password es necesario"});
        return;
    }
    var results = await Cliente.find({email: body.email, password: sha1(body.password)});
    var results1 = await USER.find({email: body.email, password: sha1(body.password)});
    if (results.length == 1) {
        var token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60*60),
            data: results[0].id
        },'Proyectkeysecret');

        res.status(200).json({msn: "Bienvenido " + body.email + " al sistema", token: token});
        return;
    }
    res.status(200).json({msn: "Credenciales incorrectas"});
});

/*
 USUARIO PARA REGISTRAR RESTAURANTE
*/
//POST
router.post("/user", midleware, (req, res) => {
    var userRest = req.body;
    var params = req.body;
    if (params.password == null) {
        res.status(300).json({msn: "El password es necesario pra continuar con el registro"});
        return;
    }
    if (params.password.length < 6) {
        res.status(300).json({msn: "Es demasiado corto"});
        return;
    }
    if (!/[A-Z]+/.test(params.password)) {
        res.status(300).json({msn: "El password necesita una letra Mayuscula"});
        
        return;
    }
    if (!/[\$\^\@\&\(\)\{\}\#]+/.test(params.password)) {
        res.status(300).json({msn: "Necesita un caracter especial"});
        return;
    }
    params.password = sha1(params.password);
    var userDB = new USER(params);
    userDB.save((err, docs) => {
        if (err) {
            var errors = err.errors;
            var keys = Object.keys(errors);
            var msn = {};
            for (var i = 0; i < keys.length; i++) {
                msn[keys[i]] = errors[keys[i]].message;
            }
            res.status(500).json(msn);
            return;
        }
        res.status(200).json(docs);
        return;
    })
});
// GET Users
router.get('/user', midleware, (req, res) => {
    var params = req.query;
    var limit = 100;
    if (params.limit != null) {
        limit = parseInt(params.limit);
    } 
    var skip = 0;
    if (params.skip != null) {
        skip = parseInt(params.skip);
    }
    USER.find({}).limit(limit).skip(skip).exec((err, docs) => {
        res.status(200).json(docs);
    console.log('mostrando users');
    });
});
//PUT
router.put("/user", midleware, async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["nombre", "telefono"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    USER.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
        return;
    });

});
// DELETE User 
router.delete("/user", midleware, async(req,res) => {
    var id = req.query.id;
    console.log(req.query.id);
    if (id == null) {
      res.status(300).json({
        msn: "introducir id"    
      });
      return;
    }
    var result = await USER.remove({_id: id});
    res.status(200).json(result);
    console.log('user deleted');
  });
/*
 CLIENTE
*/
//POST
router.post("/cliente", (req, res) => {
    var clienteRest = req.body;
    var params = req.body;
    if (params.password == null) {
        res.status(300).json({msn: "El password es necesario para continuar con el registro"});
        return;
    }
    if (params.password.length < 6) {
        res.status(300).json({msn: "Es demasiado corto"});
        return;
    }
    if (!/[A-Z]+/.test(params.password)) {
        res.status(300).json({msn: "El password necesita una letra Mayuscula"});
        
        return;
    }
    if (!/[\$\^\@\&\(\)\{\}\#]+/.test(params.password)) {
        res.status(300).json({msn: "Necesita un caracter especial"});
        return;
    }
    params.password = sha1(params.password);
    var cliente = new Cliente (params);
    cliente.save((err, docs) => {
        if (err) {
            var errors = err.errors;
            var keys = Object.keys(errors);
            var msn = {};
            for (var i = 0; i < keys.length; i++) {
                msn[keys[i]] = errors[keys[i]].message;
            }
            res.status(500).json(msn);
            return;
        }
        res.status(200).json(docs);
        return;
    })
});

//GET
router.get("/cliente",  (req, res) => {
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
router.put("/cliente",  async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["nombre","calle","telefono"];
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
router.delete("/cliente",  (req, res) => {
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
