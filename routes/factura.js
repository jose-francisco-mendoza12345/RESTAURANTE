var express = require('express');
var router = express.Router();
var Detalle = require("../database/factura");

const PDFDocument = require('pdfkit');
//const fs = require('fs');
var nodemailer = require('nodemailer'); // email sender function
router.get('/facturas/:id', function (req, res, next) {


    Orden.findById(req.params.id).populate('restaurant').populate('menus').populate('cliente').exec()
        .then(doc => {

            // Create a document

            pdf = new PDFDocument

            let idOrden = req.params.id;
            let writeStream = fs.createWriteStream(idOrden + '.pdf');
            pdf.pipe(writeStream);
            // Add another page

            pdf
                .fontSize(20)
                .text('Id de Factura : ' + idOrden, 100, 100)
                .moveDown()

            pdf.fontSize(12).text('Nombre o Razon Social ' + doc.cliente.nombre, {
                width: 412,
                align: 'left'
            })
            
            })
            pdf.moveDown()
            pdf.text('Cedula de Indentidad ' + doc.cliente.ci, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            //pdf.rect(pdf.x, 0, 410, pdf.y).stroke()


            pdf.text('telefono :  ' + doc.cliente.nombre, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()

            pdf.text('DETALLE DE PEDIDO', {
                width: 412,
                align: 'center'
            })
            pdf.moveDown()
            pdf.text('Restaurant : ' + doc.restaurant.nombre, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('nit : ' + doc.restaurant.nit, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('direccion : ' + doc.restaurant.calle, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            pdf.text('telefono : ' + doc.restaurant.telefono, {
                width: 412,
                align: 'left'
            })
            pdf.moveDown()
            //image
             pdf.image('out2.png', pdf.x, pdf.y, {
                width: 300
            })

            pdf.text('nombre \n precio \n cantidad', {
                width: 412,
                height: 15,
                columns: 3,
                align: 'left'
            })
            pdf.moveTo(95, pdf.y)
                .lineTo(510, pdf.y).stroke()

            pdf.moveDown()
            console.log(pdf.x, pdf.y);
            pdf.rect(pdf.x - 5, pdf.y, 410, doc.menus.length * 20).stroke()

            for (let index = 0; index < doc.menus.length; index++) {
                //pdf.rect(pdf.x, pdf.y, 410, 15).stroke()
                pdf.text(doc.menus[index].nombre + '\n' + doc.menus[index].precio + '\n' + doc.cantidad[index], {
                    width: 412,
                    align: 'left',
                    height: 15,
                    columns: 3
                })
                pdf.moveDown()
            }
            pdf.text('total :  ' + doc.pago_total, {
                width: 412,
                align: 'right'
            })
            pdf.moveDown()



            pdf.text('Fecha de venta : ' + doc.Fecha_Registro.toString(), {
                width: 412,
                align: 'center'
            })
            pdf.moveDown()
// Finalize PDF file
            pdf.end()



            //pdf.pipe(res.status(201));

            //res.status(500).json();

            //enviar el pdf al correo del cliente .

            //let config = JSON.parse(fs.readFileSync("config.json"))
            //console.log(config.password);

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {

                    user: 'padillajosuemendoza8540940@gmail.com', //su correo ,del que se enviara el email
                    pass: ' //aqui va la contraseña de su correo

                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                from: 'Api Rest Store!',
                to: 'padillajosuemendoza8540940@gmail.com',
                subject: 'Factura por servicio',
                text: 'Adjuntamos la factura por servicio de comidas',
                attachments: [{
                    path: "./" + idOrden + ".pdf"
                }]
            };

            writeStream.on('finish', function () {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            error: error
                        });
                    } else {


                        pdf = new PDFDocument;
                        let writeStreamG = fs.createWriteStream(idOrden + '.pdf');
                        pdfg.pipe(writeStreamG);

                        pdfg.fontSize(20)
                            .text('Id de  : ' + idOrden, 100, 100)
                            .moveDown()

                        pdfg.fontSize(12).text('Nombre o Razon Social ' + doc.cliente.nombre, {
                            width: 412,
                            align: 'left'
                        })
                        pdfg.image('out2.png', pdfg.x, pdfg.y, {
                            width: 300
                        })
                        pdfg.end()

                        writeStreamG.on('finish', function () {
                            res.status(200).download('./' + idOrden + '.pdf');
                        });
                        console.log('done...!');

                    }
                });

            });

        }).catch(err => {
            res.status(500).json({
                error: err || "error"
            });
        });


    //doc.pipe(res.status(201));
});

//insertar datos de] menu
router.post("/detalle",  (req, res) => {

  //Ejemplo de validacion
  var data = req.body;
  data ["registerdate"] = new Date();
  var newdetalle = new Detalle(data);
  newdetalle.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": newrestaurant,
      "id" : rr._id,
      "msn" :  "pedidos agregado con exito"
    });
  });
});
router.get("/pedidos",(req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  Pedidos.find({}).skip(skip).limit(limit).exec((err, docs) => {
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



//mostrar  por id detalle
router.get(/pedidos\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Pedidos.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.json({
      result : docs    });
  })
});
//elimina un restaurant
router.delete('/detalle/:id',  (req, res, )=> {
  var idDetalle = req.params.id;

  Orden.findByIdAndRemove(idOrden).exec()
      .then(() => {
          res.json({
              message: "Orden eliminado"
          });
      }).catch(err => {
          res.status(500).json({
              error: err
          });
      });


});

module.exports = router;


