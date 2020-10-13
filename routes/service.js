var express = require('express');
var sha1 = require('sha1');
var router = express.Router();
var fileupload = require('express-fileupload')
var Restaurant  = require("../database/restaurant");
var Menus  = require("../database/menu");
var Orden  = require("../database/orden");
router.use(fileupload({
    fileSize: 50 * 1024 * 1024
}));
/*
 RESTAURANT
*/
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
/*
 MENU
*/
//POST
router.post("/menu", (req, res) => {
 
  var FotoProducto = req.files.fotoProducto;
   console.log(req.files.fotoProducto);
  var path = __dirname.replace(/\/routes/g, "/Imagenes/Menu");
  var date = new Date();
  var sing  = sha1(date.toString()).substr(1, 5);
  var totalpath = path + "/" + sing + "_" + FotoProducto.name.replace(/\s/g,"_");
  FotoProducto.mv(totalpath, async(err) => {
        if (err) {
            return res.status(500).send({msn : "Error al escribir el archivo en el disco duro"});
        }
  });
  var datos = req.body;
  var obj = {};
  obj["nombre"] = datos.nombre;
  obj["precio"] = datos.nit;
  obj["descripcion"] = datos.propietario;
  obj["fecha"] = datos.fecha;
  obj["fotoProducto"] = totalpath;
  obj["hash"] = sha1(totalpath);
  obj["relativepath"] = "/api/1.0/sendfile/?id=" + obj["hash"]
  var menu = new Menus(obj);
  menu.save((err, docs) => {
    if (err) {
         res.status(500).json({msn: "ERROR "})
           return;
    }
    res.status(200).json({msn: "Restaurante Registrado"}); 
  });
});

router.get("/getfile", async(req, res, next) => {
    var params = req.query;
    if (params == null) {
        res.status(300).json({ msn: "Error es necesario un ID"});
        return;
    }
    var id = params.id;
    var menu =  await Menus.find({hash: id});
    if (menu.length > 0) {
        var path = menu[0].fotoProducto;
        res.sendFile(path);
        return;
    }
    res.status(300).json({
        msn: "Error en la petición"
    });
    return;
});
//GET
router.get("/menu", async(req, res) => {
    var filterdata = req.query;
    var filterarray = ["nombre", "precio"];
    var nombre = filterdata["nombre"];
    var precio = filterdata["precio"];
    var filter = {};
    if (nombre != null) {
        filter["nombre"] = new RegExp(nombre, "g");
    }
    if (precio != null) {
        filter["precio"] = precio;
    }
    var limit = 100;
    var skip = 0;
    if (filterdata["limit"]) {
        limit = parseInt(filterdata["limit"]);
    }
    if (filterdata["skip"]) {
        skip = parseInt(filterdata["skip"]);
    }
    var docs = await Menus.find(filter).limit(limit).skip(skip);
    res.status(200).json(docs);
});
//PUT
router.put("/menu", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.nit == null) {
        res.status(300).json({msn: "El parámetro NIT es necesario"});
        return;
    }
    var allowkeylist = ["nombre","descripcio","precio"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    Menus.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
       res.status(200).json(docs);
       return;
    });
});
//DELETE
router.delete("/menu", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    Menus.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
/*
 ORDEN
*/
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
module.exports = router
