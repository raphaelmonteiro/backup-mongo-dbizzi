const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transport.use(
    'compile',
    hbs({
        // viewEngine: '.handlebars',
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('./src/mailer/template/'),
            layoutsDir: path.resolve('./src/mailer/template/'),
            defaultLayout: undefined,
        },
        viewPath: path.resolve('./src/mailer/template/'),
        extName: '.html',
    })
);

exports.mailer = transport;
