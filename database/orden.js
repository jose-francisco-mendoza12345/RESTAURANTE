var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    idmenu:{
       type: Schema.Types.ObjectId,
       ref: "menu"
    },
    idrestaurant: {
       type: Schema.Types.ObjectId,
       ref: "restaurante" 
    },
    cantidad: {
        type: Number
    }, 
    precio: {
       type: Number
    },/*
    idcliente: {
       type: Schema.Types.ObjectId,
       ref: "cliente" 
    },*/
    lugardeenvio: [
       lat:{
        type: Array
       },
       lng:{
        type: Array
       },
    ],
    pagototal: {
        type: Number
    },
});

var USER = mongoose.model("orden", USERSCHEMA);
module.exports = USER;
