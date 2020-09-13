var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    /*idmenu:{
        type:
    },
    idrestorant: {
        type:
    },
    ****necesitamos hacer conexion con las id de las otras tablas*/
    cantidad: {
        type: Number,
        required: [true,"la cantida es requerida"]
    },
    /*
    idcliente: {
        type:
    },
    *****necesitamos hacer conexion con las id de las otras tablas*/
    lugardeenvio: {
        type: String,
        required:[true,"latitud y longitud son necesarios"]
    },
    /*
    pagototal: {
        type:
    },
    necesitamos el valor de los precios para (precio * cantidad)*/
});

var USER = mongoose.model("orden", USERSCHEMA);
module.exports = USER;