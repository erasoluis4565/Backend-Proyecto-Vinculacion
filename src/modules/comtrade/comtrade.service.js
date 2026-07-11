const ImportacionExportacion =
    require("./comtrade.model");

const clienteComtrade =
    require("./comtrade.client");

// =========================================
// FUNCIONES AUXILIARES
// =========================================

const obtenerPeriodos = () => {

    const actual =
        new Date().getFullYear();

    return [

        actual - 3,

        actual - 2,

        actual - 1

    ];

};

const convertirFlujo =
    (flow) => {

        return flow === "IMPORT"

            ? "M"

            : "X";

    };

const obtenerUnidad =
    (codigo) => {

        switch (codigo) {

            case 8:
                return "Kilogramos";

            case -1:
                return "No aplica";

            default:
                return "Desconocido";

        }

    };
const construirConsulta =
    (configuracion, flujo, periodo) => {

        return {

            typeCode: "C",

            freqCode:
                configuracion
                    .comtrade
                    .frecuencia,

            clCode:
                configuracion
                    .comtrade
                    .clasificacion,

            cmdCode:
                configuracion.hsCode,

            reporterCode:
                configuracion
                    .paisReportante
                    .codigoM49,

            partnerCode:
                configuracion
                    .comtrade
                    .partnerCode,

            flowCode:
                convertirFlujo(
                    flujo
                ),

            period:
                periodo,

            maxRecords: 500

        };

    };

const esperar =
    (ms) => {

        return new Promise(

            resolve =>

                setTimeout(

                    resolve,

                    ms

                )

        );

    };
const ejecutarConsulta =
    async (parametros) => {

        try {

            const respuesta =
                await clienteComtrade.get(

                    "/data/v1/get/C/A/HS",

                    {

                        params: {

                            ...parametros,

                            "subscription-key":
                                process.env
                                    .COMTRADE_API_KEY

                        }

                    }

                );

            return respuesta.data;

        }

        catch (error) {

            console.error(

                "Error UN Comtrade:",

                error.response?.data ||

                error.message

            );

            throw new Error(

                "No fue posible consultar UN Comtrade."

            );

        }

    };
// =========================================
// TRANSFORMACIÓN DE DATOS
// =========================================

const transformarDatos =
    (respuesta, anio) => {

        if (

            !respuesta ||

            !respuesta.data ||

            respuesta.data.length === 0

        ) {

            return {

                anio,

                cantidad: 0,

                valorUSD: 0,

                moneda: "USD",

                unidad: "No disponible",

                disponible: false

            };

        }

        const registro =
            respuesta.data[0];

        return {

            anio,

            cantidad:
                registro.qty || 0,

            valorUSD:
                registro.primaryValue || 0,

            moneda: "USD",

            unidad:
                obtenerUnidad(
                    registro.qtyUnitCode
                ),

            disponible:
                registro.primaryValue > 0


        };

    };

// =========================================
// CONSULTAR UN FLUJO (IMPORT O EXPORT)
// =========================================

const consultarFlujo =
    async (

        configuracion,

        flujo

    ) => {

        const resultados = [];

        const periodos =
            obtenerPeriodos();

        for (

            const anio of periodos

        ) {

            const parametros =
                construirConsulta(

                    configuracion,

                    flujo,

                    anio

                );

            const respuesta =
                await ejecutarConsulta(
                    parametros
                );

            resultados.push(

                transformarDatos(

                    respuesta,

                    anio

                )

            );

            // Espera para evitar
            // el Rate Limit

            await esperar(1200);

        }

        return resultados;

    };
// =========================================
// MÉTODOS DEL SERVICIO
// =========================================

const obtenerCatalogo =
    async () => {

        return await ImportacionExportacion
            .find({

                estado: {

                    $in: [

                        "ACTIVO",

                        "PENDIENTE_REVISION"

                    ]

                }

            })

            .sort({

                nombreComun: 1

            });

    };

const obtenerPorPlanta =
    async (plantaSlug) => {

        return await ImportacionExportacion
            .findOne({

                plantaSlug

            });

    };

const consultarComtrade =
    async (plantaSlug) => {

        const configuracion =
            await obtenerPorPlanta(
                plantaSlug
            );

        if (!configuracion) {

            throw new Error(
                "No existe configuración Comtrade para esta planta."
            );

        }

        const importaciones =
            await consultarFlujo(

                configuracion,

                "IMPORT"

            );

        await esperar(1200);

        const exportaciones =
            await consultarFlujo(

                configuracion,

                "EXPORT"

            );

        return {

            planta:
                configuracion.nombreComun,

            nombreCientifico:
                configuracion.nombreCientifico,

            hsCode:
                configuracion.hsCode,

            hsDescripcion:
                configuracion.hsDescripcion,

            periodos:
                obtenerPeriodos(),
                
            importaciones,

            exportaciones

        };

    };

module.exports = {

    obtenerCatalogo,

    obtenerPorPlanta,

    consultarComtrade

};