import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import { Student } from './entities/Student';
import { OfferedClass } from './entities/Class';

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

    async close() {
        let conn = getConnection();
        if (conn) await conn.close();
    }

    async drop() {
        let conn = getConnection();
        await conn.dropDatabase();
    }

}

