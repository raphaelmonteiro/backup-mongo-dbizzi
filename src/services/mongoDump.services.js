const { spawn } = require('child_process');
const { mailer } = require('../mailer');

const DB = {
    DB_DATABASE: process.env.DB_DATABASE,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
};

module.exports = (ARCHIVE_PATH) => {
    options = [];
    if (DB.DB_USERNAME) options.push('--username=' + DB.DB_USERNAME);
    if (DB.DB_PASSWORD) options.push('--password=' + DB.DB_PASSWORD);
    if (DB.DB_PASSWORD) options.push('--authenticationDatabase=admin');
    if (DB.DB_DATABASE) options.push('--db=' + DB.DB_DATABASE);
    if (DB.DB_HOST) options.push('--host=' + DB.DB_HOST);
    if (DB.DB_PORT) options.push('--port=' + DB.DB_PORT);
    options.push('--archive=' + ARCHIVE_PATH);
    options.push('--gzip');

    const child = spawn('mongodump', options);

    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data);
    });
    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString());
    });
    child.on('error', (error) => {
        console.log('error:\n', error);
    });
    child.on('exit', (code, signal) => {
        if (code) console.log('Process exit with code:\n', code);
        else if (signal) console.log('Process killed with signal:\n', signal);
        else {
            mailer.sendMail(
                {
                    to: 'raphael.hexa@gmail.com',
                    from: process.env.EMAIL_USERNAME,
                    subject: `IZZI - BACKUP DIARIO REALIZADO`,
                    template: 'backup_diario',
                },
                (err, data) => {
                    console.log(err);

                    if (err) console.log('Cannot send email');

                    console.log('send email');
                }
            );

            console.log('Backup is successfull');
        }
    });
};
