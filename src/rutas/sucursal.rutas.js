var express = require("express");
var sucursalControlador = require("../controladores/sucursal.controlador");
var md_autorizacion = require("../middlewares/authenticated.js");
var api = express.Router();

api.post("/registrarSucursal", sucursalControlador.registrarSucursal);
api.put("/editarSucursal", md_autorizacion.ensureAuth, sucursalControlador.editarSucursal);
api.post("/eliminarSucursal", sucursalControlador.eliminarSucursal);
api.get("/listarSucursales", md_autorizacion.ensureAuth, sucursalControlador.listarSucursales);
api.get("/obtenerSucursalxNombre", md_autorizacion.ensureAuth, sucursalControlador.obtenerSucursalxNombre);


module.exports = api;