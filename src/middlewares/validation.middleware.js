const {
    validationResult
} = require("express-validator");

const validarCampos = (
    req,
    res,
    next
) => {

    const errores =
    validationResult(req);

    if (!errores.isEmpty()) {

        return res.status(400).json({

            success: false,

            errores: errores.array()

        });

    }

    next();

};

module.exports = validarCampos;