var mongoose = require("./connect");
var mon = require('mongoose');
var Schema = mon.Schema;

var clienteSchema = new Schema({
  nombre : String,
  ci : String,
  calle: String,
  telefono : Number,
  tipo : String,
  email: {
        type: String,
        required: [true, "El email es necesario"],
        validate: {
            validator: (value) => {
                return /^[\w\.]+@[\w\.]+\.\w{3,3}$/.test(value);
            },
            message: props => `${props.value} no es valido`
        }
        
    },
    password: {
        type: String,
        required: [true, "El password es necesario"],
    },
   roles: {
        type: Array,
        default: []
   },
   Fecha_Registro: {
      type: Date,
      default: Date.now()
   }
});

var cliente = mongoose.model("Cliente", clienteSchema);
module.exports = cliente;
