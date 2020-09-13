var mongoose = require("mongoose");
mongoose.connect("mongodb://172.20.0.2:27017/restaurantedatabase", {useNewUrlParser: true});
var db  = mongoose.connection;
db.on("error", () => {
    console.log("ERROR no se puede conectar al servidor");
});
db.on("open", () => {
    console.log("Conexion exitosa");
});
module.exports = mongoose;
