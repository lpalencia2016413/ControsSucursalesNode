'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_super_secreta';

exports.createToken = function(empresa) {
    var payload = {
        sub: empresa._id,
        username: empresa.username,
        rol: empresa.rol,
        imagen: empresa.imagen,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret);
}