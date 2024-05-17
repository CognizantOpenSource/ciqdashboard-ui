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
import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StageParams, FieldType } from 'src/app/components/form/dynamic-field/dynamic-field.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { parseApiError } from 'src/app/components/util/error.util';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { IDashBoardApiService } from '../../services/ciqdashboard-api.service';
/**
* NewLOBComponent
* @author Cognizant
*/
interface Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-lob',
  templateUrl: './new-lob.component.html',
  styleUrls: ['./new-lob.component.css'],
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
export class NewLOBComponent implements OnInit {


  orgs$: any;
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
    private location: Location, private projectService: DashboardProjectService, private ciqdashboardAPIService: IDashBoardApiService,
    private router: Router, private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef) {
    this.ciqdashboardAPIService.getORGs().subscribe((orgs: any) => {
      this.params[2] = {
        name: 'orgId',
        type: FieldType.selectORGObject,
        data: orgs,
        label: 'Organization',
        optional: false
      };
      this.cdRef.markForCheck();
    }, (error) => {
      console.log(error);
    });
    this.params = [
      {
        name: 'lobName',
        type: FieldType.text,
        label: 'Name',
        optional: false
      },
      {
        name: 'lobDescription',
        type: FieldType.text,
        label: 'Description',
        optional: true
      },
      {
        name: 'orgId',
        type: FieldType.selectORGObject,
        data: this.orgs$,
        label: 'Organization',
        optional: false
      }/* ,
      {
        name: 'projects',
        type: FieldType.selectMulti,
        data: ['Project 01','Project 02','Project 03','Project 04','Project 05','Project 06','Project 07'],
        label: 'Projects',
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
    this.projectService.loadORGs();
    this.orgs$ = this.projectService.orgs$;
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
    const { lobName, lobDescription, orgId } = this.form.getRawValue();
    //console.log('lobname',lobName,lobName.length);
    if(lobName.length < 4)
    {
      this.toastr.error('please enter lob name as more than three character');
      return;
    }
    this.complete.emit({ lobName, lobDescription, orgId });
    this.projectService.createLOB({ lobName, lobDescription, orgId }).subscribe(lob => {
      if (lob.id) {
        this.toastr.success('lob created successfully');
        this.closed(event);
        this.projectService.loadLOBs();
      } else {
        this.toastr.error('error while creating lob');
      }
    },
      error => {
        const parsedError = parseApiError(error, 'error while creating lob!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }
  closed(event: KeyboardEvent | MouseEvent) {
    this.location.back();
  }
}
