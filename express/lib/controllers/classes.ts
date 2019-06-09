
import * as util from 'util';
import { Request, Response, NextFunction } from "express";

import {
    classes as allClasses,
    getOfferedClass
} from '../models/classes';


export async function home(req: Request, res: Response, next: NextFunction) {
    try {
        let classes = await allClasses();
        console.log(`controllers classes home ${util.inspect(classes)}`);
        res.render('classes', { title: 'Classes', classes });
    } catch(err) {
        console.error(`class home ERROR ${err.stack}`);
        next(err); 
    }
}

export async function read(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.query);
        let clazz = await getOfferedClass(req.query.code);
        console.log(`read ${req.query.code} => ${util.inspect(clazz)}`);
        res.render('class', {
            title: clazz.name,
            code: clazz.code,
            class: clazz
        });
    } catch(err) {
        console.error(`class read ERROR ${err.stack}`);
        next(err); 
    }
}
