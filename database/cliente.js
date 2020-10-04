var mongoose = require("./connect");
const Schema = mongoose.Schema;

var clienteSchema = new Schema({
  nombre : String,
  ci : String,
  telefono : Number,
  email : String,
  password : String,
  Fecha_Registro: {
      type: Date,
      default: Date.now()
  }
});
var cliente = mongoose.model("Cliente", clienteSchema);
module.exports = cliente;
