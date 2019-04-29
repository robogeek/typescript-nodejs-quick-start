import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as path from "path";
import * as hbs from 'hbs';
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import { RegistrarDB } from "registrar";
import * as studentController from './controllers/students';
import * as registrarController from './models/registrar';

export class App {
    public app: express.Application;
    public registrar: RegistrarDB;
  
    public static bootstrap(): App {
        return new App();
    }
    
    constructor () {
        this.app = express();
        this.configure();
        this.mountRoutes();
    }

    private configure(): void {
        this.registrar = new RegistrarDB();
        registrarController.init(this.registrar);
        this.app.use(express.static(path.join(__dirname, '..', 'public')));

        this.app.use('/assets/vendor/bootstrap/css', express.static( 
            path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css'))); 
        this.app.use('/assets/vendor/bootstrap/js', express.static( 
            path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'js'))); 
        this.app.use('/assets/vendor/jquery', express.static( 
            path.join(__dirname, '..', 'node_modules', 'jquery', 'dist'))); 
        this.app.use('/assets/vendor/popper.js', express.static( 
            path.join(__dirname, '..', 'node_modules', 'popper.js', 'dist')));  
        
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

        this.app.use(function(err: any, 
                                req: express.Request, 
                                res: express.Response, 
                                next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        this.app.use(errorHandler());
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