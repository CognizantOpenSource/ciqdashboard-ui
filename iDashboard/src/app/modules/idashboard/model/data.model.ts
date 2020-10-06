import { Type } from '@angular/core';
export interface IDashboardProjet {
    id: string;
    name: string;
}

export type IFieldType = 'string' | 'number' | 'boolean' | 'date'
export interface IFieldDef {
    name: string;
    label: string;
    type: IFieldType;
}
export interface IFilterConfig {
    maxValue: any;
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
    projectName: string;
    gridConfig?: IGridConfig;
    items?: Array<IDashBoardItem | any>;
    pages?: any[];
    active?:boolean;
    
}

export interface IDashboardPage {
    name: string;
    gridConfig: IGridConfig;
    items: Array<IDashBoardItem | any>;
    active?:boolean;
}
