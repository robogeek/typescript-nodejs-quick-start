
import * as util from 'util';
import * as express from 'express';

import { 
    Student,
    OfferedClass,
    getOfferedClassRepository
} from 'registrar';
import * as fileUpload from 'express-fileupload';
import { promises as fsp } from 'fs';


export async function home(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    let classes = await getOfferedClassRepository().allClasses();
    console.log(`controllers classes home ${util.inspect(classes)}`);
    res.render('classes.html', { title: 'Classes', classes });
}

export async function read(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    console.log(req.query);
    let clazz = await getOfferedClassRepository()
                        .findOneClass(<string>req.query.code);
    console.log(`read ${req.query.code} => ${util.inspect(clazz)}`);
    res.render('class.html', {
        title: clazz.name,
        code: clazz.code,
        class: clazz
    });
}

export async function handleUpload(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction): Promise<void> {

    if (!req.files
        || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    const classesyaml = (<fileUpload.UploadedFile>req.files.classesyml);

    if (classesyaml.mimetype !== 'application/x-yaml') {
        res.status(400).send(`Uploaded file ${classesyaml} not a YAML file`);            
    }

    await getOfferedClassRepository().updateClasses(classesyaml.tempFilePath);
    await fsp.unlink(classesyaml.tempFilePath);
    res.redirect('/classes/list');
}
