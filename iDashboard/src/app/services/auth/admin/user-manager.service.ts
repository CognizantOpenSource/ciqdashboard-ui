import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { IUser } from 'src/app/model/access.model';
import { AuthRestAPIService } from '../auth-rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  private _usersSource: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
  private _rolesSource: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
  private _permissionsSource: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
  private _users$: Observable<any[]>;
  private _roles$: Observable<any[]>;
  private _permissions$: Observable<any[]>;

  constructor(
    private restApi: AuthRestAPIService,
     private toastr: ToastrService, private location: Location) {
    this._users$ = this._usersSource.asObservable();
    this._roles$ = this._rolesSource.asObservable();
    this._permissions$ = this._permissionsSource.asObservable();
  }
  get users$() {
    return this._users$;
  }
  get roles$() {
    return this._roles$;
  }
  get permissions$() {
    return this._permissions$;
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

}
