const jwt =
require("jsonwebtoken");

const bcrypt =
require("bcrypt");

const UsuarioAdmin =
require("../usuarios-admin/usuario-admin.model");

const auditoriaService =
require(
    "../../services/auditoria.service"
);

const login = async (datos) => {

    const usuario =
    await UsuarioAdmin.findOne({

        correo: datos.correo,

        estado: "ACTIVO"

    });

    console.log("Usuario encontrado:", usuario);

    if (!usuario) {

        throw new Error(
            "Credenciales inválidas"
        );

    }

    const passwordValida =
    await bcrypt.compare(

        datos.password,

        usuario.passwordHash

    );

    if (!passwordValida) {

        throw new Error(
            "Credenciales inválidas"
        );

    }

    usuario.ultimoAcceso =
    new Date();

    await usuario.save();

    await auditoriaService.registrar(

        "LOGIN",

        "usuarios_admin",

        usuario.correo,

        "Inicio de sesión"

    );

    const token =
    jwt.sign(

        {
            id: usuario._id,
            correo: usuario.correo,
            rol: usuario.rol
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
            process.env.JWT_EXPIRES_IN
        }

    );

    return {

        success: true,

        token,

        usuario: {

            id: usuario._id,

            correo:
            usuario.correo,

            nombreCompleto:
            usuario.nombreCompleto,

            rol:
            usuario.rol

        }

    };

};

module.exports = {
    login
};