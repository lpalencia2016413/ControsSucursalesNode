'use strict'
// IMPORTACIONES
var Sucursal = require("../modelos/sucursal.model");
var fs = require('fs');
var path = require('path');

function registrarSucursal(req, res) {
    var sucursalModel = new Sucursal();
    var params = req.body;

    if (req.user.rol === 'ROL_ADMIN' || req.user.rol === 'ROL_EMPRESA') {
        if (params.nombreSucursal) {
            sucursalModel.nombreSucursal = params.nombreSucursal;
            sucursalModel.direccionSucursal = params.direccionSucursal;
            sucursalModel.empresa = req.user.sub;
            Sucursal.findOne({ nombreSucursal: params.nombreSucursal, empresa: req.user.sub }).exec((err, SucursalEncontrado) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (!SucursalEncontrado) {
                    sucursalModel.save((err, sucursalEncontrado) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if (!sucursalEncontrado) return res.status(500).send({ mensaje: 'No se pudo guardar la sucursal' });
                        return res.status(200).send({ sucursalEncontrado });
                    });

                } else {
                    return res.status(500).send({ mensaje: 'esta sucursal ya exixste' });
                }
            });

        } else {
            return res.status(500).send({ mensaje: 'Debe llenar todos los parametros' });
        }

    } else {
        return res.status(500).send({ mensaje: 'no posee permisos para realizar esta accion' });
    }
}

function editarSucursal(req, res) {
    var params = req.body;

    delete params.password;
    delete params.rol;

    if (req.user.rol === 'ROL_ADMIN' || req.user.rol === 'ROL_EMPRESA') {
        Sucursal.updateOne({ _id: params._id }, {
            $set: {
                nombreSucursal: params.nombreSucursal,
                direccionSucursal: params.direccionSucursal,
            }
        }, { new: true }, (err, sucursalEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!sucursalEncontrada) return res.status(500).send({ mensaje: 'No se a podido editar la Sucursal' });
            return res.status(200).send({ sucursalEncontrada })
        })
    } else {
        return res.status(500).send({ message: 'No tienes permiso para actualizar los datos' });
    }
}


function eliminarSucursal(req, res) {
    var params = req.body;
    Sucursal.findOne({ nombreSucursal: params.nombreSucursal }, (err, sucursalEliminada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticiones' });
        if (sucursalEliminada) {
            Sucursal.findByIdAndDelete(sucursalEliminada._id, (err, sucursalEliminada) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                return res.status(200).send({ sucursalEliminada });
            });
        }
    })
}

function listarSucursales(req, res) {

    Sucursal.find({ empresa: req.user.sub }, (err, sucursalesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!sucursalesEncontradas) return res.status(500).send({ mensaje: 'Aún no hay sucursales' });

        return res.status(200).send({ sucursalesEncontradas });
    });
}



function obtenerSucursalxNombre(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;
    Producto.find({ 'empresa': empresaID, nombreSucursal: params.nombreSucursal }, (err, sucursalEncontrada) => {
        if (err) res.status(500).send({ mensaje: 'La sucursal que intenta buscar no esta disponible' })
        return res.status(200).send({ sucursalEncontrada })

    })
}


module.exports = {
    registrarSucursal,
    editarSucursal,
    eliminarSucursal,
    listarSucursales,
    obtenerSucursalxNombre
}