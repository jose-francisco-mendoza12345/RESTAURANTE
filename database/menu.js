var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nombre:{
        type: String,
        default: "None data",
        required: [true, "el nombre de la comida es necesario"]  
    },
    precio:{
        type: Number     
    },
    descripcion:{
        type: String
    },
    fecha: {
        type: Date,
        default: new Date()
    },
    fotoProducto: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    },
    hash: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    },
    relativepath: {
        type: String
    }
    
});

var USER = mongoose.model("menu", USERSCHEMA);
module.exports = USER;
