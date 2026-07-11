const axios = require("axios");

const clienteComtrade =
axios.create({

    baseURL:
    "https://comtradeapi.un.org",

    timeout:
    Number(
        process.env.COMTRADE_TIMEOUT
    )

});

module.exports =
clienteComtrade;