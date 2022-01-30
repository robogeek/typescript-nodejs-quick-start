import { EntityRepository, Repository } from "typeorm";

import * as util from 'util';

import { getStudentRepository, Student } from './index.js';
import { StudentPhoto } from './entities/StudentPhoto';

@EntityRepository(StudentPhoto)
export class StudentPhotoRepository extends Repository<StudentPhoto> {

    async createAndSave(studentphoto: StudentPhoto): Promise<number> {
        if (!StudentPhotoRepository.isStudentPhoto(studentphoto)) {
            throw new Error(`Bad pet supplied`);
        }
        const photo = new StudentPhoto();
        photo.url = studentphoto.url;
        await this.save(photo);
        return photo.id;
    }

    async findOnePhotoByURL(photourl: string): Promise<StudentPhoto> {
        const thephoto = await this.findOne({ 
            where: { url: photourl },
            relations: [ "student" ]
        });
        // console.log(`findOnePhotoByURL ${photourl} `, thephoto);
        if (!StudentPhotoRepository.isStudentPhoto(thephoto)) {
            throw new Error(`StudentPhoto url ${util.inspect(photourl)} did not retrieve a StudentPhoto`);
        }
        return thephoto;
    }

    async findOnePhoto(photoid: number): Promise<StudentPhoto> {
        const photo = await this.findOne({ 
            where: { id: photoid },
            relations: [ "student" ]
        });
        // console.log(`findOnePhoto ${photoid} `, photo);
        if (!StudentPhotoRepository.isStudentPhoto(photo)) {
            throw new Error(`StudentPhoto id ${util.inspect(photoid)} did not retrieve a StudentPhoto`);
        }
        return photo;
    }

    async addPhoto(studentid: number, photoid: number): Promise<void> {
        const photo = await this.findOnePhoto(photoid);
        // console.log(`addPhoto ${photoid}`, photo);
        if (!StudentPhotoRepository.isStudentPhoto(photo)) {
            throw new Error(`Bad photo supplied`);
        }
        await getStudentRepository().createQueryBuilder('student')
                        .relation(Student, 'photos')
                        .of(studentid)
                        .add(photoid);
    }

    async deletePhoto(studentid: number, photoid: number): Promise<void> {
        const photo = await this.findOnePhoto(photoid);
        // console.log(`addPhoto ${photoid}`, photo);
        if (!StudentPhotoRepository.isStudentPhoto(photo)) {
            throw new Error(`Bad photo supplied`);
        }
        await getStudentRepository().createQueryBuilder('student')
                        .relation(Student, 'photos')
                        .of(studentid)
                        .remove(photoid);
    }

    static isStudentPhoto(studentphoto: StudentPhoto): studentphoto is StudentPhoto {
        return typeof studentphoto === 'object'
            && typeof studentphoto.url === 'string';
    }

}
