var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nombre:{
        type: String,
        required: [true, "el nombre del restaurante es necesario"]
    },
    nit: {
        type: Number,
        required: [true, "El nit es necesario"]
    },
    propietario:{
        type: String,
        required:[true, "el nombre del propietario es necesario"]
    },
    calle: {
        type: String,
        required: [true, "La direccion es requerida"]
    },
    telefono: {
        type: String
    },

    //Varible Log ---->FALTA QUE ES<---------
    //Varible Lat ---->FALTA QUE ES<---------
    //Varible Logo ---->tipo de archivo imagen<---------

    fechaderegistro: {
        type: Date,
        default: new Date()
    }

    ////Varible FotoLugar ---->tipo de archivo imagen<---------

});

var USER = mongoose.model("restaurante", USERSCHEMA);
module.exports = USER;