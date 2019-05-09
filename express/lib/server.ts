import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as path from "path";
import * as hbs from 'hbs';
import * as methodOverride from 'method-override';

import * as registrar from "registrar";
import * as studentController from './controllers/students.js';

import { requireIt } from 'require-it';

// import { fileURLToPath } from 'url';

// console.log(import.meta);

// const modulePath = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(modulePath);

export class App {
    public app: express.Application;
    public registrar: registrar.RegistrarDB;
  
    constructor () {
        // console.log(express);
        this.app = express();
        this.configure();
        this.mountRoutes();
    }

    private configure(): void {
        this.registrar = new registrar.RegistrarDB(path.join(__dirname, '..', 'registrarDB'));
        this.app.use(express.static(path.join(__dirname, '..', 'public')));

        this.app.use('/assets/vendor/bootstrap/css', express.static( 
            path.join(requireIt.directory('bootstrap'), 'dist', 'css'))); 
        this.app.use('/assets/vendor/bootstrap/js', express.static( 
            path.join(requireIt.directory('bootstrap'), 'dist', 'js'))); 
        this.app.use('/assets/vendor/jquery', express.static( 
            path.join(requireIt.directory('jquery'), 'dist'))); 
        this.app.use('/assets/vendor/popper.js', express.static( 
            path.join(requireIt.directory('popper.js'), 'dist')));  
        
        this.app.set('views', path.join(__dirname, '..', 'views'));
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(path.join(__dirname, '..', 'partials'));

        this.app.use(logger("dev"));

        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        this.app.use(cookieParser('keyboard mouse'));
        this.app.use(methodOverride());
    }

    private mountRoutes (): void {
        const router = express.Router();
        router.get('/', studentController.home);
        router.get('/registrar/students/create', studentController.create);
        router.post('/registrar/students', studentController.createUpdateStudent);
        router.get('/registrar/students/read', studentController.read);
        router.get('/registrar/students/update', studentController.update);
        router.get('/registrar/students/destroy', studentController.destroy);
        router.post('/registrar/students/destroy/confirm', studentController.dodestroy);
        this.app.use('/', router);
    }
}

export default new App();