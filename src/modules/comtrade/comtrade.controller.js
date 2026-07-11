const comtradeService =
    require("./comtrade.service");

const catalogo =
    async (req, res) => {

        const resultado =

            await comtradeService
                .obtenerCatalogo();

        res.status(200)
            .json(resultado);

    };

const obtenerPlanta =
    async (req, res) => {

        const resultado =

            await comtradeService
                .obtenerPorPlanta(

                    req.params.plantaSlug

                );

        if (!resultado) {

            return res.status(404).json({

                mensaje:

                    "Planta no encontrada"

            });

        }

        res.status(200)
            .json(resultado);

    };

const consultar =
    async (req, res) => {

        const resultado =
            await comtradeService
                .consultarComtrade(
                    req.params.plantaSlug
                );

        res.status(200)
            .json(resultado);

    };

module.exports = {

    catalogo,

    obtenerPlanta,

    consultar

};