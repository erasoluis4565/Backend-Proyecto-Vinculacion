const Fuente =
require("./fuente.model");

const obtenerTodas = async () => {

    return await Fuente.find();

};

const crear = async (data) => {

    return await Fuente.create(data);

};

module.exports = {
    obtenerTodas,
    crear
};