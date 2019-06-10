import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as util from 'util';
import * as path from "path";
import * as hbs from 'hbs';
import * as methodOverride from 'method-override';

import { requireIt } from 'require-it';

import * as http from "http";

import { default as RegistrarDB } from "registrar";
import { updateClasses } from "registrar/dist/Classes";
import * as studentController from './controllers/students.js';
import * as classesController from './controllers/classes.js';


(async () => {

const app = express();

// Initialize the database
const registrar = new RegistrarDB();
await registrar.init(path.join(__dirname, '..', 'registrardb.sqlite'));
// Update the classes list
await updateClasses(path.join(__dirname, '..', 'classes.yaml'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/assets/vendor/bootstrap/css', express.static( 
    path.join(requireIt.directory('bootstrap'), 'dist', 'css'))); 
app.use('/assets/vendor/bootstrap/js', express.static( 
    path.join(requireIt.directory('bootstrap'), 'dist', 'js'))); 
app.use('/assets/vendor/jquery', express.static( 
    path.join(requireIt.directory('jquery'), 'dist'))); 
app.use('/assets/vendor/popper.js', express.static( 
    path.join(requireIt.directory('popper.js'), 'dist')));  

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '..', 'partials'));

app.use(logger("dev"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser('keyboard mouse'));
app.use(methodOverride());


const router = express.Router();
router.get('/', studentController.home);
router.get('/classes/list', classesController.home);
router.get('/classes/read', classesController.read);
router.get('/registrar/students/create', studentController.create);
router.post('/registrar/students', studentController.createUpdateStudent);
router.get('/registrar/students/read', studentController.read);
router.get('/registrar/students/update', studentController.update);
router.get('/registrar/students/destroy', studentController.destroy);
router.post('/registrar/students/destroy/confirm', studentController.dodestroy);
app.use('/', router);


const httpPort = normalizePort(process.env.PORT || 8080);
app.set("port", httpPort);
const httpServer = http.createServer(app);
httpServer.listen(httpPort);

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

process.on('uncaughtException', function(err) { 
    console.error("I've crashed - uncaughtException - "+ (err.stack || err)); 
  }); 
  
  process.on('unhandledRejection', (reason, p) => {
    console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
  });
  
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
    return false;
}


})()
.catch(err => {
    console.error(`Uncaught error `, err);
    process.exit(1);
});