var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nick: String,
    age: Number,
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
    create: {
        type: Date,
        default: new Date()
    }
});
var USER = mongoose.model("user", USERSCHEMA);
module.exports = USER;
