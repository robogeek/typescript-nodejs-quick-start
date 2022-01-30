import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as util from 'util';
import * as path from 'path';
import * as http from "http";
import { requireIt } from 'require-it';
import * as nunjucks from 'nunjucks';
import * as methodOverride from 'method-override';
import * as fileUpload from 'express-fileupload';

import Router from "express-promise-router";

import * as Registrar from 'registrar';

import * as studentController from './controllers/students.js';
import * as classesController from './controllers/classes.js';

/*
// import * as path from 'path';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
*/

import { env } from 'process';

env.TYPEORM_CONNECTION  = 'sqlite';
env.TYPEORM_DATABASE    = path.join(__dirname, '..', 'registrardb.sqlite');
env.TYPEORM_SYNCHRONIZE = "true";
env.TYPEORM_LOGGING     = "false";

const app: express.Express = express();

app.set('views', path.join(__dirname, '..', 'views'));
nunjucks.configure([
    path.join(__dirname, '..', 'views'),
    path.join(__dirname, '..', 'layouts'),
    path.join(__dirname, '..', 'partials')
], {
    autoescape: true,
    express: app,
    watch: true
});
// app.set('view engine', 'nunjucks');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser('keyboard mouse'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(methodOverride());

app.use(fileUpload({
    // limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/',
    debug: true
}));

app.use('/assets/vendor/bootstrap/css', express.static(
    path.join(requireIt.directory('bootstrap'), 'dist', 'css')));
app.use('/assets/vendor/bootstrap/js', express.static(
    path.join(requireIt.directory('bootstrap'), 'dist', 'js')));
app.use('/assets/vendor/popper.js', express.static(
    path.join(requireIt.directory('popper.js'), 'dist')));

const router = Router();
// const router = express.Router();

router.get('/', studentController.home);
router.get('/classes/list', classesController.home);
router.get('/classes/read', classesController.read);
router.post("/classes/update/upload", classesController.handleUpload);
router.get('/registrar/students/create', studentController.create);
router.post('/registrar/students', studentController.createUpdateStudent);
router.get('/registrar/students/read', studentController.read);
router.get('/registrar/students/update', studentController.update);
router.get('/registrar/students/destroy', studentController.destroy);
router.post('/registrar/students/destroy/confirm', studentController.dodestroy);

/* router.get('/',
    async function (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void>
    {
        try {
            console.log(req.query);
            console.log(req.query.id);
            res.render('index.html', { title: 'Students' });
        } catch(err) {
            console.error(`student read ERROR ${err.stack}`);
            next(err); 
        }
    }); */


app.use('/', router);

let httpPort;
let httpServer;

(async () => {
    // Connect to the database
    await Registrar.connect();

    // Proceed with setting up the HTTP Server
    httpPort = normalizePort(process.env.PORT || 8080);
    app.set("port", httpPort);
    httpServer = http.createServer(app);
    installErrorHandler(httpServer);
    httpServer.listen(httpPort, () => {
        console.log(`=================================`);
        console.log(`======= ENV: ${app.get('env')} =======`);
        console.log(`App listening on the port ${app.get('port')}`);
        console.log(`=================================`);
    });
    
})().catch (err => {
    console.error(`Could not set up server because `, err);
    process.exit(1);
});

export default app;

// Abstracted from https://nodejs.org/api/errors.html
interface SystemError {
    address: string; 
    code: string; 
    dest: string;
    errno: number | string;
    info: any;
    message: string;
    path: string;
    port: number;
    syscall: string;
}

function installErrorHandler(httpServer) {
    httpServer.on("error", function(error: SystemError) {
        if (error.syscall !== "listen") {
            throw error;
        }

        const bind = typeof httpPort === "string"
            ? "Pipe " + httpPort
            : "Port " + httpPort;

        switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
        }
    });
}

process.on('uncaughtException', function(err) { 
    console.error("I've crashed - uncaughtException - "+ (err.stack || err)); 
});
  
process.on('unhandledRejection', (reason, p) => {
    console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});
  
function normalizePort(val): number {
    const port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
    throw new Error(`normalizePort given invalid port specifier ${val}`);
}

