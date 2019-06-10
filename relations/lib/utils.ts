
import { createConnection, getRepository } from "typeorm";
import { Student } from './entities/Student';
import { Category } from './entities/Category';
import { PetType } from './entities/PetType';
import { Photo } from './entities/Photo';
import { OfferedClass } from './entities/OfferedClass';
import * as path from 'path';

export async function mkConnection() {
    await createConnection({
        type: "sqlite",
        database: path.join(__dirname, '..', 'testdb.sqlite'),
        synchronize: true,
        logging: false,
        entities: [
            // Student, Category, PetType, Photo, OfferedClass
            path.join(__dirname, '..', 'dist', 'entities', '*.js')
        ]
    });
}

export async function createPetType(type: string) {
    const type1 = new PetType();
    type1.name = type;
    let petTypeRepository = getRepository(PetType);
    return await petTypeRepository.save(type1);
}

export async function createPhoto(url: string) {
    const photo = new Photo();
    photo.url = url;
    let photoRepository = getRepository(Photo);
    return await photoRepository.save(photo);
}

export async function createClass(code: string, name: string) {
    const clazz = new OfferedClass();
    clazz.code = code;
    clazz.name = name;
    let classRepository = getRepository(OfferedClass);
    return await classRepository.save(clazz);
}

export async function createCategory(cat: string) {
    const category1 = new Category();
    category1.name = cat;
    let categoryRepository = getRepository(Category);
    return await categoryRepository.save(category1);
}

export async function createStudent(
            name: string,
            entered: number,
            grade: number,
            gender: string) {
    let student = new Student();
    student.name = name;
    student.entered = entered;
    student.grade = grade;
    student.gender = gender;
    let studentRepository = getRepository(Student);
    return await studentRepository.save(student);
}