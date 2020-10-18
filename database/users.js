var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nombre: String,
    ci: Number,
    telefono: Number,
    tipo: String,
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
    fecha: {
        type: Date,
        default: new Date()
    }
});
var USER = mongoose.model("user", USERSCHEMA);
module.exports = USER;
