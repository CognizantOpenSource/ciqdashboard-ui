import { Injectable } from '@angular/core';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { IFieldDef } from '../model/data.model';

interface IOpDef {
    type: string;
    fn: (data: any, filterVal: any, ...arg: any) => boolean
}
interface IOps {
    [name: string]: IOpDef
}
@Injectable({
    providedIn: 'root'
})
export class FilterOps {

    private opsMap: { [type: string]: Array<{ name: string, type: string }> } = {};

    constructor(private db: LocalStorage) {
        ['string', 'number', 'boolean', 'date'].forEach(type => {
            this.opsMap[type] = [];
            Object.keys(this.ops).forEach(action => {
                if (this.ops[action].type.includes(type)) {
                    // current action supports the data type
                    this.opsMap[type].push({
                        type: this.ops[action].type,
                        name: action
                    })
                }
            });
        });

    }

    public get actions() {
        return this.opsMap;
    }
    public get(actn: string, fieldDef: IFieldDef): (data: any, filterVal: any, ...args: any) => boolean {
        const op = this.ops[actn.toLowerCase()];
        if (op) {
            if (op.type.includes(fieldDef.type || 'string')) {
                return op.fn;
            }
            throw new Error(`'${actn}' only supports '${op.type}' fields supported`);
        }
        throw new Error(`'${actn}' not supported`);
    }

    private ops: IOps = {

        equals: {
            type: 'string|number|boolean|date',
            fn: (data: any, filterVal: any) => data === filterVal
        },
        ne: {
            type: 'string|number|boolean|date',
            fn: (data: any, filterVal: any) => data === filterVal
        },
        in: {
            type: 'string|number',
            fn: (data: any, filterVal: any) => data === filterVal
        },
        nin: {
            type: 'string|number',
            fn: (data: any, filterVal: any) => data === filterVal
        },
        contains: {
            type: 'string',
            fn: (data: any, filterVal: any) => (data as string).includes(filterVal)
        },
        notcontains: {
            type: 'string',
            fn: (data: any, filterVal: any) => !(data as string).includes(filterVal)
        },
        startswith: {
            type: 'string',
            fn: (data: any, filterVal: any) => (data as string).startsWith(filterVal)
        },
        endswith: {
            type: 'string',
            fn: (data: any, filterVal: any) => (data as string).endsWith(filterVal)
        },

        matches: {
            type: 'string',
            fn: (data: any, filterVal: any) => (data as string).match(filterVal) != null
        },

        gt: {
            type: 'number|date',
            fn: (data: any, filterVal: any, def: IFieldDef) => {
                if (def.type == 'number') {
                    return data > filterVal;
                } else {
                    return new Date(data) > new Date(filterVal)
                }
            }
        },
        lt: {
            type: 'number|date',
            fn: (data: any, filterVal: any, def: IFieldDef) => {
                if (def.type == 'number') {
                    return data < filterVal;
                } else {
                    return new Date(data) < new Date(filterVal)
                }
            }
        },
        gte: {
            type: 'number|date',
            fn: (data: any, filterVal: any, def: IFieldDef) => true
        },
        lte: {
            type: 'number|date',
            fn: (data: any, filterVal: any, def: IFieldDef) => true
        },
        between: {
            type: 'number|date',
            fn: (data: any, filterVal: any, def: IFieldDef) => true
        },
    };


}