'use strict'
// IMPORTACIONES
var productoSucursal= require("../modelos/productoSucursal.model");
var fs = require('fs');
var path = require('path');

function productoxSucursal(req, res) {
    var empresaID = req.user.sub
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA' || req.user.rol === 'ROL_ADMIN' ) {
        if (params.nombre) {
            var productoModel = new Producto();
            productoSucursalModel.nombre = params.nombre;
            productoSucursalModel.nombreProveedor = params.nombreProveedor;
            productoSucursalModel.cantidadVendida = params.cantidadVendida;
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


function ventaProductos(req, res) {
    var params = req.body;
    var cantidadVendida = Number(params.cantidadVendida)
    Producto.findOne({ _id: params._id }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'error' });

        if (productoEncontrado.stock < cantidadVendida) {
            return res.status(200).send({ mensaje: 'Cantidad insuficiente' });
        } else {
            Producto.findOneAndUpdate({ _id: params._id }, { $inc: { cantidadVendida: cantidadVendida, stock: -cantidadVendida } }, { new: true }, (err, productoEditado) => {
                return res.status(200).send({ productoEditado });
            });
        }
    })
}

module.exports = {
   productoxSucursal,
   ventaProductos
}