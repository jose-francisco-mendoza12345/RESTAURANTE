var express = require('express');
var sha1 = require('sha1');
var router = express.Router();
var fileupload = require('express-fileupload')
var USER  = require("../database/menu");
router.use(fileupload({
    fileSize: 50 * 1024 * 1024
}));

//POST
router.post("/menu", (req, res) => {
    var datos = req.body;
    var imagen = req.files.fotoProducto;
    var path = __dirname.replace(/\/routes/g, "/Imagenes/Menu");
    var date = new Date();
    var sing  = sha1(date.toString()).substr(1, 5);
    var totalpath = path + "/" + sing + "_" + imagen.name.replace(/\s/g,"_");
    imagen.mv(totalpath, async(err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
        var obj = {};
        obj["nombre"] = datos.nombre;
        obj["precio"] = datos.precio;
        obj["descripcion"] = datos.descripcion;
        obj["fecha"] = datos.fecha;
        obj["fotoProducto"] = totalpath;
        obj["hash"] = sha1(totalpath);
        obj["relativepath"] = "/api/1.0/getfile/?id=" + obj["hash"];
        var menu = new USER(obj);
        menu.save((err, docs) => {
            if (err) {
                res.status(500).json({msn: "ERROR "})
                return;
            }
            res.status(200).json({msn: "Menu Registrado"}); 
            //res.status(200).json({name: imagen.name});
        });
    });
 });
router.get("/getfile", async(req, res, next) => {
    var params = req.query;
    if (params == null) {
        res.status(300).json({ msn: "Error es necesario un ID"});
        return;
    }
    var id = params.id;
    var menu =  await USER.find({hash: id});
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
    var docs = await USER.find(filter).limit(limit).skip(skip);
    res.status(200).json(docs);
});

//DELETE
router.delete("/user", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    USER.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
module.exports = router;
