const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: false,

    auth: {

        user: process.env.SMTP_USER,

        pass: process.env.SMTP_PASS

    }

});

const enviarCorreoBienvenida = async (nombre, correo) => {

    const opciones = {

        from: process.env.EMAIL_FROM,

        to: correo,

        subject: "🌿 Bienvenido al boletín del Agro Vivero Medicinal",

        html: `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width:650px; margin:auto; padding:30px; border:1px solid #ddd; border-radius:12px">

                <h1 style="color:#1c7c36">
                    Agro Vivero Medicinal
                </h1>

                <p>Hola <strong>${nombre}</strong>,</p>

                <p>
                    Gracias por suscribirte a nuestro boletín.
                </p>

                <p>
                    A partir de ahora recibirás noticias,
                    investigaciones, artículos y novedades
                    relacionadas con las plantas medicinales.
                </p>

                <hr>

                <p style="font-size:13px;color:#666">

                    Este correo fue enviado automáticamente.

                </p>

            </div>
        `

    };

    return transporter.sendMail(opciones);

};

const enviarCorreoNuevaPlanta = async (
    nombre,
    correo,
    planta
) => {

    const opciones = {

        from: process.env.EMAIL_FROM,

        to: correo,

        subject: `🌿 Nueva planta disponible: ${planta.nombreComun}`,

        html: `

        <div style="font-family:Arial;padding:30px;max-width:700px;margin:auto">

            <h2 style="color:#1c7c36">
                Agro Vivero Medicinal
            </h2>

            <p>
                Hola <strong>${nombre}</strong>,
            </p>

            <p>
                Hemos agregado una nueva planta medicinal a nuestro catálogo.
            </p>

            <hr>

            <h3>
                ${planta.nombreComun}
            </h3>

            <p>
                <strong>Nombre científico:</strong>
                ${planta.nombreCientifico}
            </p>

            <p>
                ${planta.descripcion || ""}
            </p>

            <br>

            <p>
                Ingresa al Agro Vivero para conocer toda la información.
            </p>

            <hr>

            <small>
                Este correo fue enviado automáticamente.
            </small>

        </div>

        `

    };

    return transporter.sendMail(opciones);

};

const verificarConexion = async () => {

    await transporter.verify();

    console.log("✅ Conexión SMTP establecida.");

};

module.exports = {

    enviarCorreoBienvenida,
    
    enviarCorreoNuevaPlanta,

    verificarConexion

};