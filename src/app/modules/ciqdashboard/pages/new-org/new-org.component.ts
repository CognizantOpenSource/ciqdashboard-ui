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
import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { StageParams, FieldType } from 'src/app/components/form/dynamic-field/dynamic-field.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { parseApiError } from 'src/app/components/util/error.util';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
/**
* NewProjectComponent
* @author Cognizant
*/
interface Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-org',
  templateUrl: './new-org.component.html',
  styleUrls: ['./new-org.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'scale(.99,.99)', opacity: 0.9 }),
        animate('300ms', style({ transform: 'scale(1,1)', opacity: 1 }))
      ])
    ]
    )
  ]
})
export class NewORGComponent implements OnInit {


  @Input() params: StageParams[];
  _project = {};
  @Input() set project(project: any) {
    this._project = project;
  }
  get project(): any {
    return this._project;
  }
  form: FormGroup;
  duplicateProject = {
    state: false,
    value: ''
  };

  @Output() complete = new EventEmitter<any>();

  constructor(
    private location: Location, private projectService: DashboardProjectService,
    private router: Router, private toastr: ToastrService,
    private formBuilder: FormBuilder) {
    this.params = [
      {
        name: 'organizationName',
        type: FieldType.text,
        label: 'Name',
        optional: false
      },
      {
        name: 'organizationDesc',
        type: FieldType.text,
        label: 'Description',
        optional: true
      }/* ,
      {
        name: 'lobs',
        type: FieldType.selectMulti,
        data: ['LOB 01','LOB 02','LOB 03','LOB 04','LOB 05','LOB 06','LOB 07'],
        label: 'LOBs',
        optional: false
      } */
    ] as StageParams[];
    const group = {};
    for (const param of this.params) {
      group[param.name] = [this.project[param.name] || '', param.optional ? [] : [Validators.required]];
    }
    this.form = this.formBuilder.group(group);
  }

  ngOnInit() {

  }

  blur(param: StageParams, value) {
    if (param.name === 'name') {
      const projectName = value;
      this.duplicateProject.state = false;
      this.projectService.searchProject(projectName).subscribe((projects: Array<Project>) => {
        if (projects[0]) {
          this.duplicateProject.state = true;
          this.duplicateProject.value = projectName;
        }
      });
    }
  }
  create(event: KeyboardEvent | MouseEvent) {
    if (!this.form.valid) {
      this.toastr.warning('please provide valid inputs');
      return;
    }
    const { organizationName, organizationDesc } = this.form.getRawValue();
    //console.log('orgname',organizationName,organizationName.length);
    if(organizationName.length < 4)
    {
      this.toastr.error('please enter organization name as more than three character');
      return;
    }
    this.complete.emit({ organizationName, organizationDesc });
    this.projectService.createORG({ organizationName, organizationDesc }).subscribe(org => {
      if (org.id) {
        this.toastr.success('organization created successfully');
        this.closed(event);
        this.projectService.loadORGs();
      } else {
        this.toastr.error('error while creating organization');
      }
    },
      error => {
        const parsedError = parseApiError(error, 'error while creating organization!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }
  closed(event: KeyboardEvent | MouseEvent) {
    this.location.back();
  }
}
