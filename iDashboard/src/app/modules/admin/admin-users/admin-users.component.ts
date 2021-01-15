import { Component, OnInit } from '@angular/core';
import { UserManagerService } from 'src/app/services/auth/admin/user-manager.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UnSubscribable, EntityFilter, EntityCallBackFilter } from 'src/app/components/unsub';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['../../../components/form/form.css', './admin-users.component.css']
})
export class AdminUsersComponent extends UnSubscribable implements OnInit {
  users;
  selected = [];
  index = 0;
  loggedInUser: any;
  isDisableDelete = false;

  userEmailFilter = new EntityFilter('email');
  userNameFilter = new EntityCallBackFilter(it => it.firstName + ' ' + it.lastName);
  userTypeFilter = new EntityFilter('type');

  constructor(private userManagerService: UserManagerService, private authService: AuthenticationService, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    this.userManagerService.loadUsers().subscribe(users => {
      this.users = users;
    });
    this.managed(this.authService.user$).subscribe(user => this.loggedInUser = user);
  }

  activate($event) {
    if (this.selected.length === 0) {
      this.toastr.warning('Please select user to activate account.');
      return;
    }
    this.activateDeactivate(true);
    this.selected = [];
  }
  deactivate($event) {
    if (this.selected.length === 0) {
      this.toastr.warning('Please select user to de-activate account.');
      return;
    }
    this.activateDeactivate(false);
    this.selected = [];
  }
  deleteDetails($event) {
    if (this.selected.length === 0) {
      this.toastr.warning('Please select user to delete.');
      return;
    }
    if (confirm(`Are you sure to delete users?`)) {
      this.userManagerService.deleteUsers(getUserIds(this.selected)).subscribe(() => {
        this.toastr.success('User/s deleted successfully.');
        this.userManagerService.loadUsers().subscribe(users => {
          this.users = users;
        });
      }, error => this.toastr.error(error.error.message));
    }
    this.selected = [];
  }
  activateDeactivate(isActivated) {
    this.userManagerService.activateDeactivateUser(isActivated, getUserIds(this.selected)).subscribe(users => {
      if (users.length && isActivated) {
        this.toastr.success('User/s activated successfully.');
        this.userManagerService.loadUsers().subscribe(tempUsers => {
          this.users = tempUsers;
        });
      } else if (users.length && !isActivated) {
        this.toastr.success('User/s de-activated successfully.');
        this.userManagerService.loadUsers().subscribe(tempUsers => {
          this.users = tempUsers;
        });
      } else {
        this.toastr.error('Error while activating/deactivating user.');
      }
    }, error => this.toastr.error(error.error.message));
  }
  selectionChanged($event) {
    for (const userObject of $event) {
      if (userObject.id === this.loggedInUser.id) {
        this.isDisableDelete = true;
        return;
      } else {
        this.isDisableDelete = false;
      }
    }
  }
}
function predicateUserByName(user: any, name: string): boolean {
  return (!name || name === '')
    || user.username.toLowerCase().includes(name.toLowerCase());
}
function getUserIds(userList: any[]) {
  return [...userList.map(it => it.id)];
}
