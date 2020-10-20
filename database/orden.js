var mongoose = require("./connect");
const Schema = mongoose.Schema;

var ordenSchema = new Schema({
    cliente: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    restaurant:{
       type: Schema.Types.ObjectId,
       ref: "Restaurant"
    },
    menu : {
       type: Schema.Types.ObjectId,
       ref: "Menu"
    },
    lugarEnvio: String,
    precio: Number,
    cantidad :Number,
    pagototal: Number,
    Fecha_Registro:
    {
      type:Date,
      default: Date.now()

    },
});

var orden = mongoose.model("Orden", ordenSchema);
module.exports = orden;
