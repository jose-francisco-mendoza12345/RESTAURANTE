var mongoose = require("./connect");
const Schema = mongoose.Schema;

var ordenSchema = new Schema({
    menus : {
       type: Schema.Types.ObjectId,
       ref: "Menus"
    },
    restaurant:{
       type: Schema.Types.ObjectId,
       ref: "Restaurant"
    },
    cantidad: {
       type: Number
    }, 
    cliente: {
       type: Schema.Types.ObjectId,
       ref: "Cliente"
    },
    precio: {
       type: Number
    },
    Fecha_Registro:
    {
      type:Date,
      default: Date.now()

    },
    pagototal: {
        type: Number
    },
});

var orden = mongoose.model("Orden", ordenSchema);
module.exports = orden;
