import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API as AuthAPI } from './auth-api';

@Injectable({
  providedIn: 'root'
})
export class AuthRestAPIService {
  deleteTeam(id: any): Observable<any> {
    return this.http.delete(this.api.getTeam(id));
  }
  getTeam(id: string): Observable<any> {
    return this.http.get(this.api.getTeam(id));
  }
  addTeam(team: any): Observable<any> {
    return this.http.post(this.api.teams, team);
  }
  updateTeam(team: any): Observable<any> {
    return this.http.put(this.api.teams, team);
  }
  getTeams(): Observable<any> {
    return this.http.get(this.api.teams);
  }
  api: AuthAPI;
  constructor(private http: HttpClient) {
    this.api = new AuthAPI(environment.api.auth);
  }
  generateAPIToken() {
    return this.http.post(this.api.APIToken, null);
  }

  createToken(payload: any) {
    return this.http.post(this.api.authToken, payload);
  }
  createColectorToken(email, days): Observable<any> {
    return this.http.post(this.api.createCollectorToken({ email, days }), {});
  }
  createUser(user: any): Observable<any> {
    return this.http.post(this.api.createUser, user);
  }
  getAllUsers(): Observable<any> {
    return this.http.get(this.api.getAllUsers);
  }
  getUserById(id: string): Observable<any> {
    return this.http.get(this.api.getUserById(id));
  }
  updateUser(user: any): Observable<any> {
    return this.http.put(this.api.updateUser(user.id), user);
  }
  getProfile() {
    return this.http.get(this.api.profile);
  }
  updatePassword(params: any): Observable<any> {
    return this.http.post(this.api.updatePassword(params), null);
  }
  resetPassword(params: any): Observable<any> {
    return this.http.post(this.api.resetPassword(params), null);
  }
  // Roles
  getAllRoles(): Observable<any> {
    return this.http.get(this.api.getAllRoles);
  }
  getRoleById(roleId: string): Observable<any> {
    return this.http.get(this.api.getRoleById(roleId));
  }
  addRole(role: any): Observable<any> {
    return this.http.post(this.api.addRole(), role);
  }
  updateRole(role: any): Observable<any> {
    return this.http.put(this.api.updateRole(role.name), role);
  }
  deleteRoles(roleIds: any): Observable<any> {
    return this.http.request('DELETE', this.api.deleteRoles(), { body: roleIds });
  }
  getAllPermissions(): Observable<any> {
    return this.http.get(this.api.getAllPermissions);
  }
  // Accounts
  updateAccount(account: any): Observable<any> {
    return this.http.put(this.api.updateAccount(account.id), account);
  }
  activateDeactivateUser(accountUser: any): Observable<any> {
    return this.http.put(this.api.activateDeactivateUser(), accountUser);
  }
  deleteUsers(userIds: any): Observable<any> {
    return this.http.request('DELETE', this.api.deleteUsers(), { body: userIds });
  }
}
