const router =
require("express").Router();

router.get("/health",(req,res)=>{
    res.status(200).json({
        status:"OK",
        message:"Backend funcionando"
    });
});

router.use("/fuentes", require("../fuentes/fuente.routes"));
router.use("/noticias", require("../noticias/noticia.routes"));

module.exports = router;