
const path = require('path');
const Registrar = require('registrar');

const env = process.env;


env.TYPEORM_CONNECTION  = 'sqlite';
env.TYPEORM_DATABASE    = path.join(__dirname, '..', 'express-reflet', 'registrardb.sqlite');
env.TYPEORM_SYNCHRONIZE = "true";
env.TYPEORM_LOGGING     = "false";

(async () => {
    await Registrar.connect();
    console.log(await Registrar.getStudentRepository().findAll());
})();
