var express = require('express');
var sha1 = require('sha1');
var router = express.Router();
var fileupload = require('express-fileupload')
var jwt = require("jsonwebtoken");
var fs = require('fs');
var _ = require("underscore"); 
const PDFDocument = require('pdfkit');
var nodemailer = require('nodemailer');

var Restaurant  = require("../database/restaurant");
var Menu  = require("../database/menu");
var Orden  = require("../database/orden");
var midleware = require("./midleware");

router.use(fileupload({
    fileSize: 50 * 1024 * 1024
}));

/*
 RESTAURANT
*/
//POST
router.post("/restaurant",  (req, res) => {
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
router.get("/restaurant",midleware,  async(req, res) => {
    var filterdata = req.query;
    var filterarray = ["nombre","calle"];
    var nombre = filterdata["nombre"];
    var calle = filterdata["calle"];
    var filter = {};
    if (nombre != null) {
        filter["nombre"] = new RegExp(nombre, "g");
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
    var id = params.id;
    var restaurante =  await Restaurant.find({hash1: id});
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
    var id = params.id;
    var restaurante =  await Restaurant.find({hash2: id});
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
router.put("/restaurant",  async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
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
    Restaurant.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
       res.status(200).json(docs);
       return;
    });
});
//PATCH ->Solo por elementos
router.patch("/restaurant",  async(req, res) => {
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
router.delete("/restaurant",  (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    Restaurant.remove({_id: params.id}, (err, docs) => {
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
router.post("/menu",  (req, res) => {
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
  obj["relativepath"] = "/api/1.0/fotoProducto/?id=" + obj["hash"];
  obj["restaurant"]=datos.restaurant
  var menu = new Menu(obj);
  menu.save((err, docs) => {
    if (err) {
         res.status(500).json({msn: "ERROR "})
           return;
    }
    res.status(200).json({msn: "Restaurante Registrado"}); 
  });
});

//GET
router.get("/menu",midleware,  async(req, res) => {
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
    var docs = await Menu.find(filter).limit(limit).skip(skip).populate("restaurant");
    res.status(200).json(docs);
});
router.get("/fotoProducto", async(req, res, next) => {
    var params = req.query;
    if (params == null) {
        res.status(300).json({ msn: "Error es necesario un ID"});
        return;
    }
    var id = params.id;
    var menu =  await Menu.find({hash: id});
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
//PUT
router.put("/menu",  async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["nombre","descripcion","precio"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    Menu.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
       res.status(200).json(docs);
       return;
    });
});

//DELETE
router.delete("/menu",  (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    Menu.remove({_id: params.id}, (err, docs) => {
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
//POST
router.post("/orden",  (req, res) => {
  var datos=req.body;
  var obj={};
  obj["cliente"]=datos.cliente;
  obj["restaurant"]=datos.restaurant;
  obj["menu"]=datos.menu;
  obj["lugarEnvio"]=datos.menu;
  obj["precio"]=datos.precio;
  obj["cantidad"]=datos.cantidad;
  obj["pagototal"]=datos.pagototal;
  var guardando=new Orden(obj);  
  guardando.save().then(() => {  
    res.status(200).json({"mns" : "Orden Registrado"});
  });
 });
//GET 
router.get("/orden",  (req, res, next) =>{
  Orden.find({}).populate("cliente").populate("restaurant").populate("menu").exec((error, docs) => {
    res.status(200).json(docs);
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
    var allowkeylist = ["lugarEnvio","cantidad","cliente"];
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
/*
 FACTURA
*/
router.get("/facturas/:id", (req, res, next) => { 
      Orden.findById(req.params.id).populate("restaurant").populate("menu").populate("cliente").exec().then(doc => {
            // Crear un documento
            pdf = new PDFDocument;
            var idOrden = req.params.id;
            var writeStream = fs.createWriteStream(idOrden + '.pdf');
            pdf.pipe(writeStream);

            pdf
               .fontSize(20)
               .text('Id de Factura:' + idOrden, 100, 100)
               .moveDown();
            pdf
               .fontSize(12)
               .text('Nombre o Razon Social:' + doc.cliente.nombre, { width: 412, align: 'left'}) 
               .moveDown();
            pdf.text('Cedula de Indentidad' + doc.cliente.ci, { width: 412, align: 'left' })
               .moveDown();
            pdf.text('telefono :  ' + doc.cliente.telefono, { width: 412, align: 'left' })
               .moveDown();
            pdf.text('DETALLE DE PEDIDO', { width: 412, align: 'center'})
               .moveDown();
            pdf.text('Restaurant:' + doc.restaurant.nombre, { width: 412, align: 'left'})
               .moveDown();
            pdf.text('nit : ' + doc.restaurant.nit, { width: 412, align: 'left'})
               .moveDown();
            pdf.text('direccion:' + doc.restaurant.calle, { width: 412, align: 'left'})
               .moveDown();
            pdf.text('telefono:' + doc.restaurant.telefono, { width: 412, align: 'left' })
               .moveDown();
            pdf
               .image('mandalorian.jpg', pdf.x, pdf.y, { width: 300 })
               .text('nombre \n precio \n cantidad', { width: 412, height: 15, columns: 3, align: 'left'})
            pdf.moveTo(95, pdf.y)
               .lineTo(510, pdf.y).stroke()
            pdf.moveDown();

            console.log(pdf.x, pdf.y);
            pdf.rect(pdf.x - 5, pdf.y, 410, doc.menu.length * 20).stroke()

            for (var i = 0; i < doc.menu.length; i++) {
                pdf.text(doc.menu[i].nombre + '\n' + doc.menu[i].precio + '\n' + doc.cantidad[i], {
                    width: 412,
                    align: 'left',
                    height: 15,
                    columns: 3
                })
                pdf.moveDown();
            }

            pdf.text('total:' + doc.pagototal, {width: 412, align: 'right'})
            pdf.moveDown();

            pdf.text('Fecha de venta:' + doc.Fecha_Registro.toString(), { width: 412, align: 'center'})
            pdf.moveDown();
            // Finalizar archivo PDF
            pdf.end();    
      });
      //definimos el transporter
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          port: 25,
          auth: {
                  user: 'pedro@gmail.com', 
                  pass: '',//se pone la password
                },
          tls: {
                    rejectUnauthorized: false
               }
      });
      // Definimos el email
      var mailOptions = {
          from: 'Api Rest',
          to: 'pedro@gmail.com',
          subject: 'Factura por servicio',
          text: 'Adjuntamos la factura por servicio de comidas',
          attachments: [{ path: "./" + idOrden + ".pdf"}]
      };
      writeStream.on('finish', function (){
           // Enviamos el email
           transporter.sendMail(mailOptions, function (error, info) {
           if (error){
                     console.log(error);
                     res.status(500).json({msn: "error"});
           }else{
                 pdf = new PDFDocument;
                 var writeStreamG = fs.createWriteStream(idOrden + '.pdf');
                 pdf.pipe(writeStreamG);

                 pdf
                    .fontSize(20)
                    .text('Id de  : ' + idOrden, 100, 100)
                    .moveDown();

                 pdf
                    .fontSize(12)
                    .text('Nombre o Razon Social:' + doc.cliente.nombre, { width: 412, align: 'left'})
                    .image('mandalorian.jpg', pdf.x, pdf.y, { width: 300 })
               pdfg.end()

               writeStreamG.on('finish', function () {
                     res.status(200).download('./' + idOrden + '.pdf');
               });
                     console.log('Email sent');
           }   
          });
    
      }).catch(error => {
            res.status(500).json({msn: "error"});
      });
});
module.exports = router;
