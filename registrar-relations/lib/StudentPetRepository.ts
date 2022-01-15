import { EntityRepository, Repository } from "typeorm";

import * as util from 'util';

import { getStudentRepository } from './index.js';
import { StudentRepository } from "./StudentRepository.js";
import { StudentPet } from './entities/StudentPet.js';

@EntityRepository(StudentPet)
export class StudentPetRepository extends Repository<StudentPet> {

    async createAndSave(studentpet: StudentPet): Promise<number> {
        if (!StudentPetRepository.isStudentPet(studentpet)) {
            throw new Error(`Bad pet supplied`);
        }
        let pet = new StudentPet();
        pet.name = studentpet.name;
        pet.breed = studentpet.breed;
        // The validation is now handled by
        // the @BeforeInsert and @BeforeUpdate decorators
        // await validateOrReject(stud);
        await this.save(pet);
        return pet.id;
    }

    async findOnePet(petid: number): Promise<StudentPet> {
        let thepet = await this.findOne({ 
            where: { id: petid }
        });
        // console.log(`findOnePet ${petid} `, thepet);
        if (!StudentPetRepository.isStudentPet(thepet)) {
            throw new Error(`StudentPet id ${util.inspect(petid)} did not retrieve a StudentPet`);
        }
        return thepet;
    }

    async studentHasPet(studentid: number, petid: number): Promise<void> {
        let thepet = await this.findOnePet(petid);
        
        if (!StudentPetRepository.isStudentPet(thepet)) {
            throw new Error(`Bad pet supplied`);
        }

        let student = await getStudentRepository().findOneStudent(studentid);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }
        
        student.pet = thepet;
        await getStudentRepository().manager.save(student);
    }

    async studentHasNoPet(studentid: number): Promise<void> {
        let student = await getStudentRepository().findOneStudent(studentid);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }
        // console.log(`studentHasNoPet `, student);

        student.pet = null;
        await getStudentRepository().manager.save(student);
    }

    static isStudentPet(studentpet: any): studentpet is StudentPet {
        return typeof studentpet === 'object'
            && typeof studentpet.name === 'string'
            && typeof studentpet.breed === 'string';
    }
}

