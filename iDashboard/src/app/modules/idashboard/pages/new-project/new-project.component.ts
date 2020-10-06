import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { StageParams, FieldType } from 'src/app/components/form/dynamic-field/dynamic-field.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { parseApiError } from 'src/app/components/util/error.util';
import { DashboardProjectService } from '../../services/idashboard-project.service';
interface Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
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
  create(event: KeyboardEvent | MouseEvent) {
    if (!this.form.valid) {
      this.toastr.warning('please provide valid inputs');
      return;
    }
    const name = this.form.controls.name.value;
    const description =  this.form.controls.description.value;
    this.complete.emit({ name ,description});
    this.projectService.createProject({ name ,description}).subscribe(project => {
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
}