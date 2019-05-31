import "reflect-metadata";
import { createConnection } from "typeorm";
import { Student } from './entities/Student';
import { OfferedClass } from './entities/OfferedClass';

export default class RegistrarDB {

    constructor() {
    }

    async init(databaseFN: string) {
        await createConnection({
            type: "sqlite",
            database: databaseFN,
            synchronize: true,
            logging: false,
            entities: [
                Student, OfferedClass
            ]
         });
    }

}

