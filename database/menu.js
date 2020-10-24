var mongoose = require("./connect");
const Schema = mongoose.Schema;


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
        default: "None data",
        required: [true, "la ruta de la canción es necesaria"]
    },
    hash: {
        type: String,
        required: [true, "la ruta de la imagen es necesaria"]
    },
    restaurant:{
       type: Schema.Types.ObjectId,
       ref: "Restaurant"
    }
    
});

var menus = mongoose.model("Menu", menusSchema);
module.exports = menus;
