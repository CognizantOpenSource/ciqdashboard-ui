import { IDashboardConfig } from './report.model';

type ObjectId = string;

interface IRole {
    id: ObjectId;
    name: string;
    accessControls: Array<IPermissions>;
}
interface IPermissions {
    id: ObjectId;
    name: string;
    roles: Array<IRole>;
}
export interface IUser {
    id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password?: any;
    image: Blob | string;
    active: boolean;
}
interface IAccount {
    id: ObjectId;
    userId: ObjectId;
    roles: IRole[];
    projectIds: Array<ObjectId>;
}
export interface IExternalAppConfigEntry {
    url: string;
    callbackUrl?: string;
    usrename: string;
    token: string;
}
interface IExternalApps {
    logAnalysis: IExternalAppConfigEntry;
}
export interface IUserConfig {
    dashboard: IDashboardConfig;
    jenkins: any;
    gitbub: any;
    gitlab: any;
    bitbucket: any;
    externalApps: IExternalApps;
    [key: string]: any;
}
