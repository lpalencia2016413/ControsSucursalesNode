'use strict'
var express = require("express");

var empresaControlador = require("../controladores/empresa.controlador")
var md_autorizacion = require("../middlewares/authenticated");
var api = express.Router();

api.post("/login", empresaControlador.login);
api.put("/editarEmpresa", md_autorizacion.ensureAuth, empresaControlador.editarEmpresa);
api.get("/obtenerEmpresa", md_autorizacion.ensureAuth, empresaControlador.obtenerEmpresa);
module.exports = api;