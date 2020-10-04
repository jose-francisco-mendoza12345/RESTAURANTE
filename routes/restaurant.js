var express = require('express');
var sha1 = require('sha1');
var router = express.Router();
var fileupload = require('express-fileupload')
var Restaurant  = require("../database/restaurant");
router.use(fileupload({
    fileSize: 50 * 1024 * 1024
}));
//POST
router.post("/restaurante", (req, res) => {
  var Logo = req.files.logo;
  var FotoLugar = req.files.fotoLugar;
  var path1 = __dirname.replace(/\/routes/g, "/Imagenes/Restaurant/Logo");
  var path2 = __dirname.replace(/\/routes/g, "/Imagenes/Restaurant/Lugar");
  var date = new Date();
  var sing  = sha1(date.toString()).substr(1, 5);
  var totalpath1 = path1 + "/" + sing + "_" + Logo.name.replace(/\s/g,"_");
  var totalpath2 = path2 + "/" + sing + "_" + FotoLugar.name.replace(/\s/g,"_");
  Logo.mv(totalpath1, async(err) => {
        if (err) {
            return res.status(500).send({msn : "Error al escribir el archivo en el disco duro"});
        }
  });
  FotoLugar.mv(totalpath2, async(err) => {
        if (err) {
            return res.status(500).send({msn : "Error al escribir el archivo en el disco duro"});
        }
  });
  var datos = req.body;
  var obj = {};
  obj["nombre"] = datos.nombre;
  obj["nit"] = datos.nit;
  obj["propietario"] = datos.propietario;
  obj["calle"] = datos.calle;
  obj["telefono"] = datos.telefono;
  obj["lat"] = datos.lat;
  obj["lng"] = datos.lng;
  obj["fecha"] = datos.fecha;
  obj["logo"] = totalpath1;
  obj["hash1"] = sha1(totalpath1);
  obj["relativepath1"] = "/api/1.0/logo/?id=" + obj["hash1"];
  obj["fotoLugar"] = totalpath2;
  obj["hash2"] = sha1(totalpath2);
  obj["relativepath2"] = "/api/1.0/fotoLugar/?id=" + obj["hash2"]
  var restaurant = new Restaurant(obj);
  restaurant.save((err, docs) => {
    if (err) {
         res.status(500).json({msn: "ERROR "})
           return;
    }
    res.status(200).json({msn: "Restaurante Registrado"}); 
  });
});
//GET
router.get("/restaurante", async(req, res) => {
    var filterdata = req.query;
    var filterarray = ["nombre","nit","calle"];
    var nombre = filterdata["nombre"];
    var nit = filterdata["nit"];
    var calle = filterdata["calle"];
    var filter = {};
    if (nombre != null) {
        filter["nombre"] = new RegExp(nombre, "g");
    }
    if (nit != null) {
        filter["nit"] = nit;
    }
    if (calle != null) {
        filter["calle"] = calle;
    }
    var limit = 100;
    var skip = 0;
    if (filterdata["limit"]) {
        limit = parseInt(filterdata["limit"]);
    }
    if (filterdata["skip"]) {
        skip = parseInt(filterdata["skip"]);
    }
    var docs = await Restaurant.find(filter).limit(limit).skip(skip);
    res.status(200).json(docs);
});
router.get("/logo", async(req, res, next) => {
    var params = req.query;
    if (params == null) {
        res.status(300).json({ msn: "Error es necesario un ID"});
        return;
    }
    var nit = params.nit;
    var restaurante =  await Restaurant.find({hash1: nit});
    if (restaurante.length > 0) {
        var path = restaurante[0].logo;
        res.sendFile(path);
        return;
    }
    res.status(300).json({
        msn: "Error en la petición"
    });
    return;
});
router.get("/fotoLugar", async(req, res, next) => {
    var params = req.query;
    if (params == null) {
        res.status(300).json({ msn: "Error es necesario un ID"});
        return;
    }
    var nit = params.nit;
    var restaurante =  await Restaurant.find({hash2: nit});
    if (restaurante.length > 0) {
        var path = restaurante[0].fotoLugar;
        res.sendFile(path);
        return;
    }
    res.status(300).json({
        msn: "Error en la petición"
    });
    return;
});
//PUT
router.put("/restaurante", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.nit == null) {
        res.status(300).json({msn: "El parámetro NIT es necesario"});
        return;
    }
    var allowkeylist = ["nombre","propietario","calle","telefono","lat","lng"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    Restaurant.update({nit:  params.nit}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
       res.status(200).json(docs);
       return;
    });
});
//PATCH ->Solo por elementos
router.patch("/restaurante", async(req, res) => {
    if(req.query.id == null) {
        res.status(300).json({msn: "Error no existe id"});
        return;
    }
    var id = req.query.id;
    var params= req.body;
    Restaurant.update({_id: id}, params, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
       res.status(200).json(docs);
       return;
    });
});
//DELETE
router.delete("/restaurante", (req, res) => {
    var params = req.query;
    if (params.nit == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    Restaurant.remove({nit: params.nit}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
module.exports = router
