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
import { Type } from '@angular/core';
/**
* data model
* @author Cognizant
*/
export interface IDashboardProjet {
    id: string;
    name: string;
    lobId:string;
}

export type IFieldType = 'string' | 'number' | 'boolean' | 'date'
export interface IFieldDef {
    name: string;
    label: string;
    type: IFieldType;
}
export interface IFilterConfig {
    maxValue: any;
    period:string;
    field: string;
    op: string;
    value: string;
}
export interface IFilterData {
    logicalOperator: string;
    name: string;
    configs: IFilterConfig[];
    active?: boolean;
}

export interface IFilterOptions {
    filters: Array<IFilterData>;
    columns: Array<IFieldDef>;
} 

import { GridsterItem } from 'angular-gridster2';


export interface IGridConfig {
    rows: number;
    columns: number;
}

export interface IDashBoardItem extends GridsterItem {
    id: string;
    name: string;
    filters: IFilterConfig[];
    groupBy: any[];
}

export interface IDashboard {
    id?: string
    name: string;
    projectId?:string;
    projectName?: string;
    gridConfig?: IGridConfig;
    items?: Array<IDashBoardItem | any>;
    pages?: any[];
    active?:boolean;
    category?:string;
}

export interface IDashboardPage {
    name: string;
    gridConfig: IGridConfig;
    items: Array<IDashBoardItem | any>;
    active?:boolean;
}
