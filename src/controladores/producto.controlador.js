'use strict'
// IMPORTACIONES
var Producto = require("../modelos/producto.model");
var fs = require('fs');
var path = require('path');

function registrarProducto(req, res) {
    var empresaID = req.user.sub
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA' || req.user.rol === 'ROL_ADMIN' ) {
        if (params.nombre) {
            var productoModel = new Producto();
            productoModel.nombre = params.nombre;
            productoModel.nombreProveedor = params.nombreProveedor;
            productoModel.stock = params.stock;
            Producto.find({
                nombre: params.nombre,
                empresa: req.user.sub
            }).exec((err, productoNoEncontrado) => {
                if (err) return console.log({ mensaje: "Error en la peticion" });
                if (productoNoEncontrado.length >= 1) {
                    return res.status(500).send("Este producto ya existe");
                } else {
                    productoModel.save((err, productoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (productoGuardado) {
                            res.status(200).send({ productoGuardado });
                        } else {
                            res.status(500).send({ mensaje: "Error al registrar producto" });
                        }
                    });
                }
            });
        } else {
            if (err) return res.status(500).send({ mensaje: "Debe llenar todo los parametros" });
        }
    } else {
        return res.status(500).send({ mensaje: 'Solo la epresa puede agregar productos' })
    }
}


function editarProducto(req, res) {
    var params = req.body;

    delete params.password;
    delete params.rol;

    if (req.user.rol === 'ROL_EMPRESA' || req.user.rol === 'ROL_ADMIN' ) {
        Producto.updateOne({ _id: params._id }, {
            $set: {
                nombre: params.nombre,
                nombreProveedor: params.nombreProveedor,
                stock: params.stock,
            }
        }, { new: true }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(500).send({ mensaje: 'No se a podido editar al Producto' });

            return res.status(200).send({ productoEncontrado })
        })
    } else {
        return res.status(500).send({ message: 'No posees permiso para realizar esta accion' });
    }
}

function eliminarProducto(req, res) {
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA' || req.user.rol === 'ROL_ADMIN' ) {
        Producto.deleteOne({ _id: params._id }, (err, productoEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEliminada) return res.status(500).send({ mensaje: 'No se a podido eliminar el producto' });

            return res.status(200).send({ productoEliminada })
        })
    }
}


function obtenerProductosAscendente(req, res) {
    var empresaID = req.user.sub;
    Producto.find({ 'empresa': empresaID }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'El producto qque intenta buscar no esta disponible' })
        return res.status(200).send({ productoEncontrado })
    }).sort({ "stock": -1 })
}

function obtenerProductosDescendente(req, res) {
    var empresaID = req.user.sub;

    Producto.find({ 'empresa': empresaID }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'El producto qque intenta buscar no esta disponible' })
        return res.status(200).send({ productoEncontrado })

    }).sort({ "stock": 1 })
}

function obtenerProductoxNombre(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;

    Producto.find({ 'empresa': empresaID, nombre: params.nombre }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'El producto qque intenta buscar no esta disponible' })
        return res.status(200).send({ productoEncontrado })

    })
}


function obtenerProducto(req, res) {
    var id = req.params.id;

    Producto.findOne({ _id: id }, (err, productoagregado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!productoagregado) return res.status(500).send({ mensaje: "Error en peticion" });
        return res.status(200).send({ productoagregado });
    })

}


function listarProductos(req, res) {

    Producto.find({ empresa: req.user.sub }, (err, productoEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!productoEncontradas) return res.status(500).send({ mensaje: 'Aún no hay productos' });

        return res.status(200).send({ productoEncontradas });
    });
}


module.exports = {
    registrarProducto,
    obtenerProductosAscendente,
    obtenerProductosDescendente,
    obtenerProductoxNombre,
    editarProducto,
    eliminarProducto,
    listarProductos,
    obtenerProducto
}