'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductoxSucursalSchema = Schema({
    nombre: String,
    nombreProveedor: String,
    empresa: { type: Schema.ObjectId, ref: 'empresas' },
    cantidadVendida: Number,
});

module.exports = mongoose.model('productosxSucursal', ProductoxSucursalSchema);