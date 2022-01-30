import { EntityRepository, Repository } from "typeorm";

import * as util from 'util';

import { getStudentRepository, Student } from './index.js';
import { StudentRepository } from "./StudentRepository.js";
import { StudentPet } from './entities/StudentPet.js';

@EntityRepository(StudentPet)
export class StudentPetRepository extends Repository<StudentPet> {

    async createAndSave(studentpet: StudentPet): Promise<number> {
        if (!StudentPetRepository.isStudentPet(studentpet)) {
            throw new Error(`Bad pet supplied`);
        }
        const pet = new StudentPet();
        pet.name = studentpet.name;
        pet.breed = studentpet.breed;
        // The validation is now handled by
        // the @BeforeInsert and @BeforeUpdate decorators
        // await validateOrReject(stud);
        await this.save(pet);
        return pet.id;
    }

    async findOnePet(petid: number): Promise<StudentPet> {
        const thepet = await this.createQueryBuilder("pet")
                            .where("pet.id = :id", { id: petid })
                            .getOne();
        // console.log(`findOnePet ${petid} `, thepet);
        if (!StudentPetRepository.isStudentPet(thepet)) {
            throw new Error(`StudentPet id ${util.inspect(petid)} did not retrieve a StudentPet`);
        }
        return thepet;
    }

    async studentHasPet(studentid: number, petid: number): Promise<void> {
        const thepet = await this.createQueryBuilder("pet")
                            .where("pet.id = :id", { id: petid })
                            .getOne();
        if (!thepet) {
            throw new Error(`No pet for ${petid}`);
        }
        
        if (!StudentPetRepository.isStudentPet(thepet)) {
            throw new Error(`Bad pet supplied`);
        }

        const student = await getStudentRepository().findOneStudent(studentid);
        await getStudentRepository().createQueryBuilder('student')
                .relation(Student, "pet")
                .of(student)
                .set(thepet);
    }

    async studentHasNoPet(studentid: number): Promise<void> {
        const student = await getStudentRepository().findOneStudent(studentid);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }
        await getStudentRepository().createQueryBuilder('student')
                .relation(Student, "pet")
                .of(student)
                .set(null);
    }

    static isStudentPet(studentpet: StudentPet): studentpet is StudentPet {
        return typeof studentpet === 'object'
            && typeof studentpet.name === 'string'
            && typeof studentpet.breed === 'string';
    }
}

