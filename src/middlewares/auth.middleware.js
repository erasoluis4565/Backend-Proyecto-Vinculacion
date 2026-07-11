const jwt =
require("jsonwebtoken");

const authMiddleware = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
        req.headers.authorization;

        if (!authHeader) {

            return res
                .status(401)
                .json({

                    message:
                    "Token requerido"

                });

        }

        const token =
        authHeader.split(" ")[1];

        const payload =
        jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        req.usuario =
        payload;

        next();

    } catch {

        return res
            .status(401)
            .json({

                message:
                "Token inválido"

            });

    }

};

module.exports =
authMiddleware;