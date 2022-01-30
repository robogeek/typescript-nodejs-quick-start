import {Command, Flags} from '@oclif/core';
import Table = require('cli-table');

import * as Registrar from 'registrar';

export default class Students extends Command {
    static description = 'List students';

    static flags = {
        table: Flags.boolean({
            description: 'Output in table format',
            required: false
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(Students);
        await Registrar.connect();
        const userlist = await Registrar.getStudentRepository()
                        .findAll();
        if (flags.table) {
            let table = new Table({
                head: ['ID', 'Name', 'Entered', 'Year', 'Gender']
            });
            for (let student of userlist) {
                table.push([
                    student.id, student.name, student.entered,
                    student.grade, student.gender
                ]);
            }
            console.log(table.toString());
        } else {
            console.log(userlist);
        }
    }
}
