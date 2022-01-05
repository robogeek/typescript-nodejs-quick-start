import {Command, Flags} from '@oclif/core';
import Table = require('cli-table');

import * as Registrar from 'registrar';

export default class Classes extends Command {
    static description = 'List classes';

    static flags = {
        table: Flags.boolean({
            description: 'Output in table format',
            required: false
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(Classes);
        await Registrar.connect("registrardb.sqlite");
        const classlist = await Registrar.getOfferedClassRepository()
                        .allClasses();
        if (flags.table) {
            let table = new Table({
                head: ['Code', 'Name', 'Hours']
            });
            for (let clazz of classlist) {
                table.push([
                    clazz.code, clazz.name, clazz.hours
                ]);
            }
            console.log(table.toString());
        } else {
            console.log(classlist);
        }
    }
}
