var jwt = require("jsonwebtoken");
var USER = require("../database/users");
var  midleware = async(req, res, next) => {
  //recuperar del header el token 
var token = req.headers["authorization"];
console.log(token);
 if(token == null){
     res.status(403).json({error:" no tienes acceso a este lugar token "});
     return;
 }
 // verificar si token es valido o no 
 try{
  var decoded = jwt.verify(token, 'restaurant');
  if(decoded == null) {
     res.status(403).json({error:"no tienes acceso al token "});
     return;
  }
  if(Date.now() / 1000 > decoded.exp ){
   res.status(403).json({error:"el tiempo del  token ya expiro"});
   return;
  }
  // verifica donde ira el usuario en la la base de datos 
  var iduser = decoded.data;
  var docs = await USER.findOne({_id: iduser});
  if(docs==null){
     res.status(403).json({error:"no tienes acceso"});
     return;
  }
  var roles = docs.roles.map( item => {
      return item;
  });
  var services = req.originalUrl.substr(1, 100);
  if(services.lastIndexOf("?") > -1){
      services = services.substring(0, services.lastIndexOf("?"));
  } 
    var METHOD = req.method;
    var URL = services;
     for(var i=0; i < roles.length; i++){
      if(  METHOD == roles[i].method && URL == roles[i].service) {
      next();
    return;  
  }
}
  res.status(403).json({error:"no tienes acceso a este servicio"});
   return;
 } catch (TokenExpiredError) {
  res.status(403).json({error:"El token ya expiro"});
  return;
  } 
 }
module.exports = midleware;
