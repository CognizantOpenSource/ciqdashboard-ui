import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { IUser } from 'src/app/model/access.model';
import { AuthRestAPIService } from '../auth-rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
 
  constructor(
    private restApi: AuthRestAPIService,
     private toastr: ToastrService, private location: Location) { 
  }
 
  public loadUsers(): Observable<any> {
    return this.restApi.getAllUsers();
  }

  public getUser(id): Observable<any> {
    return this.restApi.getUserById(id);
  }

  public updateUser(user): Observable<IUser> {
    return this.restApi.updateUser(user);
  }

  public loadRoles(): Observable<any> {
    return this.restApi.getAllRoles();
  }

  public getRole(roleId): Observable<any> {
    return this.restApi.getRoleById(roleId);
  }

  public addRole(role) {
    return this.restApi.addRole(role).subscribe(roleObject => {
      if (roleObject.name) {
        this.toastr.success('Role added successfully.');
        this.location.back();
      } else {
        this.toastr.error('Error while adding role.');
      }
    }, error => this.toastr.error(error.error.message));
  }

  public updateRole(role) {
    return this.restApi.updateRole(role).subscribe(roleObject => {
      if (roleObject.name) {
        this.toastr.success('Role updated successfully.');
      } else {
        this.toastr.error('Error while updating role.');
      }
    }, error => this.toastr.error(error.error.message));
  }

  public deleteRoles(roleIds: any[]): Observable<any> {
    return this.restApi.deleteRoles(roleIds);
  }

  public getPermissions(): Observable<any> {
    return this.restApi.getAllPermissions();
  }

  public updateAccount(account): Observable<any> {
    return this.restApi.updateAccount(account);
  }

  public activateDeactivateUser(isActivated: boolean, userIds: any[]): Observable<any> {
    return this.restApi.activateDeactivateUser({ activate: isActivated, userIds });
  }

  public deleteUsers(userIds: any[]): Observable<any> {
    return this.restApi.deleteUsers(userIds);
  }
  deleteTeams(teamIds: any[]) {
    return forkJoin(teamIds.map(id => this.restApi.deleteTeam(id)));
  }
 
  public getTeams(): Observable<any> {
    return this.restApi.getTeams();
  }

  public getTeam(teamId): Observable<any> {
    return this.restApi.getTeam(teamId);
  }

  public addTeam(team) {
    return this.restApi.addTeam(team);
  }

  public updateTeam(team) {
    return this.restApi.updateTeam(team);
  }

}
