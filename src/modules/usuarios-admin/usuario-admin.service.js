const bcrypt = require("bcrypt");
const UsuarioAdmin =
require("./usuario-admin.model");

const auditoriaService =
require(
    "../../services/auditoria.service"
);

const obtenerTodos = async () => {

    return await UsuarioAdmin.find();

};

const obtenerPorId = async (id) => {

    return await UsuarioAdmin.findById(id);

};

const crear = async (data) => {

    const passwordHash =
    await bcrypt.hash(

        data.passwordHash,

        10

    );

    data.passwordHash =
    passwordHash;

    const usuario =
    await UsuarioAdmin.create(data);

    await auditoriaService.registrar(

        "INSERT",

        "usuarios_admin",

        "SISTEMA",

        `Creó el usuario administrador: ${usuario.correo}`

    );

    return usuario;

};

const actualizar = async (
    id,
    data
) => {

    const usuario =
    await UsuarioAdmin.findByIdAndUpdate(

        id,

        data,

        {
            new: true
        }

    );

    if (usuario) {

        await auditoriaService.registrar(

            "UPDATE",

            "usuarios_admin",

            "SISTEMA",

            `Actualizó el usuario administrador: ${usuario.correo}`

        );

    }

    return usuario;

};

const eliminar = async (id) => {

    const usuario =
    await UsuarioAdmin.findByIdAndUpdate(

        id,

        {
            estado: "INACTIVO"
        },

        {
            new: true
        }

    );

    if (usuario) {

        await auditoriaService.registrar(

            "DELETE",

            "usuarios_admin",

            "SISTEMA",

            `Desactivó el usuario administrador: ${usuario.correo}`

        );

    }

    return usuario;

};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};