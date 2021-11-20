var express = require("express");
var productoControlador = require("../controladores/producto.controlador");
var md_autorizacion = require("../middlewares/authenticated.js");
var api = express.Router();

api.post("/registrarProducto", md_autorizacion.ensureAuth, productoControlador.registrarProducto);
api.get("/obtenerProductosAscendente", md_autorizacion.ensureAuth, productoControlador.obtenerProductosAscendente);
api.get("/obtenerProductosDescendente", md_autorizacion.ensureAuth, productoControlador.obtenerProductosDescendente);
api.get("/obtenerProductoxNombre", md_autorizacion.ensureAuth, productoControlador.obtenerProductoxNombre);
api.put("/editarProducto", md_autorizacion.ensureAuth, productoControlador.editarProducto);
api.delete("/eliminarProducto", md_autorizacion.ensureAuth, productoControlador.eliminarProducto);
api.get("/listarProductos", md_autorizacion.ensureAuth, productoControlador.listarProductos);
api.get("/obtenerProducto/:id", md_autorizacion.ensureAuth, productoControlador.obtenerProducto);

module.exports = api;