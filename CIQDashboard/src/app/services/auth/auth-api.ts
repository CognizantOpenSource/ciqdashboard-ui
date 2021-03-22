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
export class API {
    getTeam(id: any): string {
        return `${this.teams}${id}`;
    }
    get teams(): string {
        return `${this.base}teams/`;
    }
    private base: string;
    constructor(base: string) {
        this.base = base;
    }
    get APIToken() {
        return `${this.base}external-token/current-user/token`;
    }

    get authToken() {
        return `${this.base}auth/token`;
    }
    createCollectorToken(params) {
        return `${this.base}collector/token?${this.getParams(params)}`;
    }
    get profile() {
        return `${this.base}users/profile`;
    }
    get createUser() {
        return `${this.base}auth/signup`;
    }
    get getAllUsers() {
        return `${this.base}users`;
    }
    get updatePassword() {
        return `${this.base}/users/password/update`;
    }
    get resetPassword() {
        return `${this.base}/users/password/reset`;
    }
    private getParams(params: any): string {
        return Object.keys(params || {}).filter(key => !!params[key])
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
    }
    getUserById(id: string): string {
        return `${this.base}users/${id}`;
    }
    updateUser(id: any): string {
        return `${this.base}users/${id}`;
    }
    get getAllRoles() {
        return `${this.base}roles`;
    }
    getRoleById(roleId: string): string {
        return `${this.base}roles/${roleId}`;
    }
    addRole() {
        return `${this.base}roles`;
    }
    updateRole(name: any): string {
        return `${this.base}roles/${name}`;
    }
    deleteRoles() {
        return `${this.base}roles/remove`;
    }
    get getAllPermissions() {
        return `${this.base}permissions`;
    }
    updateAccount(id: any): string {
        return `${this.base}accounts/${id}`;
    }
    activateDeactivateUser() {
        return `${this.base}users/activate`;
    }
    deleteUsers() {
        return `${this.base}users/delete`;
    }
}
export const APP_PERMISSIONS = {
    Admin: 'permission.admin'
}