var mongoose = require("./connect");
var mon = require('mongoose');
var Schema = mon.Schema;

var restaurantSchema = new Schema({
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
        default: "None data",
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
        default: "None data",
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
var restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = restaurant;
