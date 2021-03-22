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
type ObjectId = string;
/**
 * Access 
 * @author Cognizant
*/
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
    account:IAccount;
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
export interface IUserConfig {
     [key: string]: any;
}

