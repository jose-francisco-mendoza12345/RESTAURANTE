var express = require("express");
var sha1 = require("sha1");
var router = express.Router();
var Users = require("../database/users");
var Cliente = require("../database/cliente");
var jwt = require("jsonwebtoken");
//POST
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
  var result = await Cliente.findOne({email: body.email, password: sha1(body.password)}).exec((err, doc) => {
    if (err) {
      res.status(300).json({ msn : "No se puede concretar con la peticion" });
      return;
    }
    console.log(doc);
    if (doc) {
       console.log(result);
      jwt.sign({name: doc.email, password: doc.password}, "secretkey123", (err, token) => {
          console.log(result);
          res.status(200).json({
            resp:200,
            token : token,
            dato:doc
          });
      })
    } else {
      res.status(400).json({ msn : "El usuario no existe en la base de datos"});
    }
 });
});
//Middelware
function verifytoken (req, res, next) {
  //Recuperar el header
  const header = req.headers["authorization"];
  if (header  == undefined) {
      res.status(403).json({ msn: "No autorizado"});
      return;
  } else {
      req.token = header.split(" ")[1];
      jwt.verify(req.token, "secretkey123", (err, authData) => {
        if (err) {
          res.status(403).json({ msn: "No autorizado"});
        } else {
          next();
        }
      });
  }
}
module.exports = router;
