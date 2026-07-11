const Multimedia =
require("./multimedia.model");

const obtenerTodos = async () => {

    return await Multimedia.find();

};

const obtenerPorId = async (id) => {

    return await Multimedia.findById(id);

};

const crear = async (data) => {

    return await Multimedia.create(data);

};

const actualizar = async (id, data) => {

    return await Multimedia.findByIdAndUpdate(
        id,
        data,
        {
            new: true
        }
    );

};

const eliminar = async (id) => {

    return await Multimedia.findByIdAndUpdate(
        id,
        {
            estado: "INACTIVO"
        },
        {
            new: true
        }
    );

};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};