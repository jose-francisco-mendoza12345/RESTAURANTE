var mongoose = require("./connect");
const Schema = mongoose.Schema;

var menusSchema = Schema({
    nombre:{
        type: String,
        default: "None data",
        required: [true, "el nombre de la comida es necesario"]  
    },
    precio:{
        type: Number     
    },
    descripcion: String,
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

var menus = mongoose.model("Menus", menusSchema);
module.exports = menus;
