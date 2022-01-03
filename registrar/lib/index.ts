import "reflect-metadata";
import { createConnection, Connection } from "typeorm";

// These module references purposely do not have file extensions
// so we can demonstrate a difference between using CommonJS
// and ES6 modules.  If we compiled the code to ES6 modules, then
// there will be errors here from TypeScript saying it could not
// find the named modules.  This is because ES6 module format
// requires a complete filename in the import statement.
// Switch to CommonJS module format and these import statements
// work correctly. 
import { Student } from './entities/Student';
export { Student } from './entities/Student';
import { StudentRepository } from './StudentRepository';
export { StudentRepository } from './StudentRepository';
import { OfferedClassRepository } from './OfferedClassRepository';
export { OfferedClassRepository } from './OfferedClassRepository';
import { OfferedClass } from './entities/OfferedClass';
export { OfferedClass } from './entities/OfferedClass';

var  _connection: Connection;

export async function connect(databaseFN: string) {
    _connection = await createConnection({
        type: "sqlite",
        database: databaseFN,
        synchronize: true,
        logging: false,
        entities: [
            Student, OfferedClass
        ]
     });
}

export function connected() { return typeof _connection !== 'undefined'; }

export function getStudentRepository(): StudentRepository {
    return _connection.getCustomRepository(StudentRepository);
}

export function getOfferedClassRepository(): OfferedClassRepository {
    return _connection.getCustomRepository(OfferedClassRepository);
}
