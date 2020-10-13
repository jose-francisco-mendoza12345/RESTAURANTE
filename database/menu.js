var mongoose = require("./connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var menusSchema =new Schema({
    nombre: String,
    precio: Number,
    descripcion: String,
    fecha: {
        type: Date,
        default: new Date()
    },
    
    relativepath: {
        type: String
    },
    fotoProducto: {
        type: String,
        required: [true, "la ruta de la canción es necesaria"]
    },
    hash: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    }
    
});

var menus = mongoose.model("Menus", menusSchema);
module.exports = menus;
