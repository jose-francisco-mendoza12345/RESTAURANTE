var mongoose = require("./connect");

var usersSchema =new mongoose.Schema({
    Nombre:  {
        type: String,
        required: [true, 'Debe poner un nombre']
    },
    Ci: String,
    Telefono: Number,
    email:{
        type: String,
        required: 'Falta el Email',
        match: /^(([^<>()\[\]\.,;:\s @\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },
    password:{
        type: String,
        required: [true, "El password es necesario"],
    }, 
    Fecha_Registro: {
        type: Date,
        default: Date.now()
    },
    TipoUsuario : String
});
const users = mongoose.model('Users', usersSchema);
module.exports = users;
