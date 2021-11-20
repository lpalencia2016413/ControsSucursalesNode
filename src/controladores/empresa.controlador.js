'use strict'
// IMPORTACIONES
var Empresa = require('../modelos/empresa.model')
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
var fs = require('fs');
var path = require('path');

function admin(req, res) {
    var empresaModel = Empresa();
    empresaModel.username = "AdminMc";
    empresaModel.rol = "ROL_ADMIN";
    Empresa.find({
        username: "AdminMc"
    }).exec((err, adminoEncontrado) => {
        if (err) return console.log({ mensaje: "Error creando Administrador" });
        if (adminoEncontrado.length >= 1) {
            return console.log("El Administrador está listo");
        } else {
            bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                empresaModel.password = passwordEncriptada;
                empresaModel.save((err, usuarioguardado) => {
                    if (err) return console.log({ mensaje: "Error en la peticion" });
                    if (usuarioguardado) {
                        console.log("Administrador listo");
                    } else {
                        console.log({ mensaje: "El administrador no está listo" });
                    }
                });
            });
        }
    });
}

function login(req, res) {
    var params = req.body;

    Empresa.findOne({ username: params.username }, (err, EmpresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (EmpresaEncontrada) {
            bcrypt.compare(params.password, EmpresaEncontrada.password, (err, passVerificada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la petición" });
                if (passVerificada) {
                    if (params.getToken == "true") {
                        return res.status(200).send({
                            token: jwt.createToken(EmpresaEncontrada)
                        });
                    } else {
                        EmpresaEncontrada.password = undefined;
                        return res.status(200).send({ EmpresaEncontrada });
                    }
                } else {
                    return res.status(500).send({ mensaje: "El usuario no se ha podido identificar" });
                }
            })
        } else {
            return res.status(500).send({ mensaje: "Error al buscar usuario" });
        }
    });
}

function editarEmpresa(req, res) {
    var params = req.body;

    delete params.password;
    delete params.rol;

    if (req.user.rol === 'ROL_ADMIN') {
        Empresa.updateOne({ _id: params._id }, {
            $set: {
                username: params.username
            }
        }, { new: true }, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEncontrada) return res.status(500).send({ mensaje: 'No se a podido editar la Empresa' });

            return res.status(200).send({ empresaEncontrada })
        })
    } else {
        return res.status(500).send({ message: 'No posee los permisos para editar' });
    }
}

function obtenerEmpresa(req, res) {

    if (req.user.rol === "ROL_ADMIN") {
        Empresa.find({ rol: "ROL_EMPRESA" }).exec((err, empresasEncontradas) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresasEncontradas) return res.status(500).send({ mensaje: 'Error en la consutla de empresa' });
            return res.status(200).send({ empresasEncontradas });
        })
    }
}

module.exports = {
    admin,
    login,
    editarEmpresa,
    obtenerEmpresa,
}