import "reflect-metadata";
import { createConnection, getConnectionOptions, Connection } from "typeorm";

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

export var connection: Connection;

export async function connect() {
    // One option is this... to pass in a hard-coded configuration
    // _connection = await createConnection({
    //     ... hard-coded connection object
    // });

    // The next option is to read the configuration from
    // the environment or an ormconfig file, and then
    // to insert the entities configuration.
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
        entities: [
            Student, OfferedClass
        ]});
    connection = await createConnection(connectionOptions);

    // The last option is to solely rely on a
    // configuration read from the environment
    // or from an ormconfig file.
    // connection = await createConnection();

    // For inspecting the configuration
    // console.log(connection.options);
}

export function connected() {
    return typeof connection !== 'undefined'
        && connection.isConnected;
}

export function connectionOptions() {
    return connection.options;
}

export function getStudentRepository(): StudentRepository {
    return connection.getCustomRepository(StudentRepository);
}

export function getOfferedClassRepository(): OfferedClassRepository {
    return connection.getCustomRepository(OfferedClassRepository);
}
