
import path from 'path';
import * as Registrar from 'registrar';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env;

env.TYPEORM_CONNECTION  = 'sqlite';
env.TYPEORM_DATABASE    = path.join(__dirname, '..', 'express-reflet', 'registrardb.sqlite');
env.TYPEORM_SYNCHRONIZE = "true";
env.TYPEORM_LOGGING     = "false";

await Registrar.connect();
console.log(await Registrar.getStudentRepository().findAll());
