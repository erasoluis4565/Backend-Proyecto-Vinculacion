const router =
    require("express").Router();

router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend funcionando"
    });
});

router.use(
    "/auth",
    require(
        "../modules/auth/auth.routes"
    )
);

router.use(
    "/suscriptores",
    require("../modules/suscriptores/suscriptor.routes")
);

router.use(
    "/notificaciones",
    require(
        "../modules/notificaciones/notificacion.routes"
    )
);

router.use(
    "/configuracion",
    require(
        "../modules/configuracion/configuracion.routes"
    )
);

router.use(
    "/fuentes",
    require(
        "../modules/fuentes/fuente.routes"
    )
);

router.use(
    "/auditoria",
    require(
        "../modules/auditoria/auditoria.routes"
    )
);

router.use(
    "/plantas",
    require("../modules/plantas/planta.routes")
);

router.use(
    "/usuarios-admin",
    require(
        "../modules/usuarios-admin/usuario-admin.routes"
    )
);

router.use(
    "/multimedia",
    require(
        "../modules/multimedia/multimedia.routes"
    )
);

router.use(
    "/noticias",
    require(
        "../modules/noticias/noticia.routes"
    )
);

router.use(

    "/comtrade",

    require(

        "../modules/comtrade/comtrade.routes"

    )

);

module.exports = router;