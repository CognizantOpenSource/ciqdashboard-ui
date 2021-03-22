// © [2021] Cognizant. All rights reserved.
 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
 
//     http://www.apache.org/licenses/LICENSE-2.0
 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Injectable } from '@angular/core';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { IFieldDef } from '../model/data.model';

interface IOpDef {
    label?: string;
    type: string;
    fn: (data: any, filterVal: any, ...arg: any) => boolean
}
interface IOps {
    [name: string]: IOpDef
}
export const datePeriodNames = ['lastNYear', 'lastNMonth', 'lastNWeek', 'lastNDay'].reverse();
@Injectable({
    providedIn: 'root'
})
export class FilterOps {

    private opsMap: { [type: string]: Array<{ name: string, type: string, label: string; }> } = {};

    constructor(private db: LocalStorage) {
        ['string', 'number', 'boolean', 'date'].forEach(type => {
            this.opsMap[type] = [];
            Object.keys(this.ops).forEach(action => {
                if (this.ops[action].type.includes(type)) {
                    // current action supports the data type
                    this.opsMap[type].push({
                        type: this.ops[action].type,
                        name: action,
                        label: this.ops[action].label || action
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
        thisYear: { type: 'date', fn: () => true },
        thisMonth: { type: 'date', fn: () => true },
        thisWeek: { type: 'date', fn: () => true },
        thisDay: { type: 'date', fn: () => true },
        last: { type: 'date', fn: () => true }
    };


}