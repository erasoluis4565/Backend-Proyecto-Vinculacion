const Auditoria =
require("./auditoria.model");

const obtenerTodas = async () => {

    return await Auditoria.find();

};

const crear = async (data) => {

    return await Auditoria.create(data);

};

module.exports = {
    obtenerTodas,
    crear
};