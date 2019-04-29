"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const hbs = require("hbs");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const registrar_1 = require("registrar");
const studentController = require("./controllers/students");
const registrarController = require("./models/registrar");
class App {
    static bootstrap() {
        return new App();
    }
    constructor() {
        this.app = express();
        this.configure();
        this.mountRoutes();
    }
    configure() {
        this.registrar = new registrar_1.RegistrarDB();
        registrarController.init(this.registrar);
        this.app.use(express.static(path.join(__dirname, '..', 'public')));
        this.app.use('/assets/vendor/bootstrap/css', express.static(path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css')));
        this.app.use('/assets/vendor/bootstrap/js', express.static(path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'js')));
        this.app.use('/assets/vendor/jquery', express.static(path.join(__dirname, '..', 'node_modules', 'jquery', 'dist')));
        this.app.use('/assets/vendor/popper.js', express.static(path.join(__dirname, '..', 'node_modules', 'popper.js', 'dist')));
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
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    }
    mountRoutes() {
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
exports.App = App;
exports.default = new App();
