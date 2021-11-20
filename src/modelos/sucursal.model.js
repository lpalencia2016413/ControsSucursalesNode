'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SucursalSchema = Schema({
    nombreSucursal: String,
    direccionSucursal: String,
    empresa: { type: Schema.ObjectId, ref: 'empresas' },
});

module.exports = mongoose.model('sucursales', SucursalSchema);