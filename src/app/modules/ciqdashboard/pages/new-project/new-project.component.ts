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
* NewProjectComponent
* @author Cognizant
*/
interface Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
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
export class NewProjectComponent implements OnInit {


  orgs$: any=[];
  lobs$: any=[];
  
  lobslist: any=[];
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
  /* sourceTools = [
    {
      "toolName": "Jira",
      "projectNames": [
        "Internet Banking",
        "Mobile Banking"
      ]
    },
    {
      "toolName": "Jenkins",
      "projectNames": [
        "Job-1",
        "Job-2"
      ]
    }
  ]; */
  sourceTools = [];
  sourceToolNames;
  sourceToolsProjects;

  constructor(
    private location: Location, private projectService: DashboardProjectService,
    private router: Router, private toastr: ToastrService,
    private formBuilder: FormBuilder, 
    private ciqdashboardAPIService: IDashBoardApiService,
    private cdRef: ChangeDetectorRef) {
      /* 
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
    }); */
    
    this.projectService.getSourceTools().subscribe((sourceToolsList: any) => {
      //console.log('sourcetoolsdata',sourceToolsList);
      //console.log(sourceToolsList);
      this.sourceTools = sourceToolsList;
      this.params[3] = {
        name: 'sourcetoolprojects',
        type: FieldType.matMultiSelectSourceTools,
        label: 'Source Tool Projects',
        optional: true,
        data: this.sourceTools
      };
      this.cdRef.markForCheck();
    }, (error) => {
      console.log(error);
    });

    this.ciqdashboardAPIService.getLOBs().subscribe((lobs: any) => {
      this.lobslist=lobs;
      this.params[2] = {
        name: 'lobId',
        type: FieldType.selectLOBObject,
        data: lobs,
        label: 'LOB',
        optional: false
      };
      this.cdRef.markForCheck();
    }, (error) => {
      console.log(error);
    });
    this.params = [
      {
        name: 'name',
        type: FieldType.text,
        label: 'Name',
        optional: false
      },
      {
        name: 'description',
        type: FieldType.text,
        label: 'Description',
        optional: true
      }/* ,
      {
        name: 'orgId',
        type: FieldType.selectORGObject,
        data: this.orgs$,
        label: 'Organization',
        optional: false
      } */,
      {
        name: 'lobId',
        type: FieldType.selectLOBObject,
        data: this.lobs$,
        label: 'LOB',
        optional: false
      },
      {
        name: 'sourcetoolprojects',
        type: FieldType.matMultiSelectSourceTools,
        label: 'Source Tool Projects',
        optional: true,
        data: this.sourceTools
      }
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
  orgId='';
  create(event: KeyboardEvent | MouseEvent) {
    if (!this.form.valid) {
      this.toastr.warning('please provide valid inputs');
      return;
    }
    const { name, description, lobId } = this.form.getRawValue();
    //console.log('projname',name,name.length);
    if(name.length < 4)
    {
      this.toastr.error('please enter project name as more than three character');
      return;
    }
    this.orgId=  this.lobslist.find(o => o.id === lobId).orgId;
    // console.log(this.lobslist.find(o => o.id === lobId));
    this.complete.emit({ name, description, lobId });
    this.projectService.createProject({ name, description, orgId:this.orgId, lobId, "sourceTools": this.convertSourceToolProjects(this.project['sourcetoolprojects']) }).subscribe(project => {
      if (project.id) {
        this.toastr.success('project created successfully');
        this.closed(event);
        this.projectService.loadProjects();
      } else {
        this.toastr.error('error while creating project');
      }
    },
      error => {
        const parsedError = parseApiError(error, 'error while creating project!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }
  closed(event: KeyboardEvent | MouseEvent) {
    this.location.back();
  }
  convertSourceToolProjects(sourceToolsProjects) {
    var STP = sourceToolsProjects;
    //var sourceToolsProjects: any = ['Jira | Internet Banking', 'Jira | Mobile Banking', 'Jenkins | Job-1', 'Jenkins | Job-2'];
    var sourceTools = [];

    STP.forEach(projects => {
      if (sourceTools.findIndex(x => x.toolName === projects.split(' | ')[0]) === -1) {
        sourceTools.push({
          "toolName": projects.split(' | ')[0],
          "projectNames": []
        });
      }
    });
    STP.forEach(projects => {
      sourceTools[sourceTools.findIndex(x => x.toolName === projects.split(' | ')[0])].projectNames.push(projects.split(' | ')[1]);
    });
    //console.log(sourceTools);
    return sourceTools;
  }
}
