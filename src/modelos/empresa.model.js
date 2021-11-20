'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    username: String,
    password: String,
    rol: String,
    imagen: String
});

module.exports = mongoose.model('empresas', EmpresaSchema);