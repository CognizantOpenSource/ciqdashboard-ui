import { Component, OnInit } from '@angular/core';
import { UnSubscribable, EntityFilter } from 'src/app/components/unsub';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TemplatesService } from 'src/app/services/auth/admin/templates.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent extends UnSubscribable implements OnInit {
  templates = [];
  selected = [];
  templateNameFilter = new EntityFilter('templateName');
  constructor(
    private router: Router,
    private templatesService: TemplatesService, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    this.templatesService.getDashboardTemplates().subscribe(templates => {
      templates.forEach((template) => {
        let chartCounts = 0;
        template.pages.forEach(page => {
          chartCounts += page.items.length;
        });
        template = Object.assign(template, { chartCounts: chartCounts });
      });

      this.templates = templates;
    });
  }
  /* deleteRole($event: MouseEvent) {
    if (this.selected.length === 0) {
      this.toastr.warning('Please select user to delete.');
      return;
    }
    if (confirm(`Are you sure to delete role/s?`)) {
      this.userManagerService.deleteRoles(getRoleIds(this.selected)).subscribe(() => {
        this.toastr.success('Role/s deleted successfully.');
        this.userManagerService.loadRoles().subscribe(roles => {
          this.roles = roles;
        });
      }, error => this.toastr.error(error.error.message));
    }
  }
  addRole($event: MouseEvent) { this.router.navigate(['/admin/roles/_/edit']); } */
  selectionChanged($event) { this.selected = $event; }
}

function predicateRoleByName(role: any, name: string): boolean {
  return (!name || name === '')
    || role.name.toLowerCase().includes(name.toLowerCase());
}
function getRoleIds(roleList: any[]) {
  const roleIds = [];
  for (const roleObject of roleList) {
    roleIds.push(roleObject.name);
  }
  return roleIds;
}
