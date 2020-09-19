var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nombre:{
        type: String,
        required: [true, "el nombre de la comida es necesario"]  
    },
    nit:{
        type: Number     
    },
    propietario:{
        type: String
    },
    calle:{
        type: String
    },
    telefono:{
        type: Number
    },
    lat:{
        type: Array
    },
    lng:{
        type: Array
    },
    fecha: {
        type: Date,
        default: new Date()
    },
    logo: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    },
    hash1: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    },
    relativepath1: {
        type: String
    },
    fotoLugar: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    },
    hash2: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    },
    relativepath2: {
        type: String
    }
});     
var USER = mongoose.model("restaurante", USERSCHEMA);
module.exports = USER 
