import "reflect-metadata";

// These module references purposely do not have file extensions
// so we can demonstrate a difference between using CommonJS
// and ES6 modules.  If we compiled the code to ES6 modules, then
// there will be errors here from TypeScript saying it could not
// find the named modules.  This is because ES6 module format
// requires a complete filename in the import statement.
// Switch to CommonJS module format and these import statements
// work correctly. 
export { Student } from '../dist-cjs/entities/Student.js';
export { StudentRepository } from '../dist-cjs/StudentRepository.js';
export { OfferedClassRepository } from '../dist-cjs/OfferedClassRepository.js';
export { OfferedClass } from '../dist-cjs/entities/OfferedClass.js';

export {
    connect, connected, connectionOptions,
    getStudentRepository,
    getOfferedClassRepository
} from '../dist-cjs/index.js';

/* import { 
    connect as CJS_connect,
    connected as CJS_connected,
    connectionOptions as CJS_connectionOptions,
    getStudentRepository as CJS_getStudentRepository,
    getOfferedClassRepository as CJS_getOfferedClassRepository
} from '../dist-cjs/index.js'; 

export async function connect() {
    console.log('Calling CJS_connect');
    return CJS_connect();
}

export function connected() {
    console.log('Calling CJS_connected');
    return CJS_connected();
}

export function connectionOptions() {
    console.log('Calling CJS_connectionOptions');
    return CJS_connectionOptions();
}

export function getStudentRepository() {
    console.log('Calling CJS_getStudentRepository');
    return CJS_getStudentRepository();
}

export function getOfferedClassRepository() {
    console.log('Calling CJS_getOfferedClassRepository');
    return CJS_getOfferedClassRepository();
} */
