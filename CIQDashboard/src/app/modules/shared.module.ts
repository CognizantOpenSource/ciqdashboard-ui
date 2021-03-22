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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableDirective, AutoResizeDirective, StopClickDirective } from 'src/app/directives';
import { MultiLinePipe } from '../pipes/multi-line.pipe';
import { CallbackPipe } from '../pipes/callback.pipe';
import { DynamicFieldComponent } from 'src/app/components/form/dynamic-field/dynamic-field.component';
import { DropDownFilterComponent } from 'src/app/components/filter/drop-down-filter/drop-down-filter.component';
import { CardComponent } from 'src/app/components/card/card.component';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { DndModule } from 'ngx-drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InViewportModule } from 'ng-in-viewport';
import { AutocompleteLibModule } from 'angular-ng-autocomplete'; 
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { AppDurationPipe } from '../pipes/duration.pipe'; 
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    StopClickDirective,
    EditableDirective,
    AutoResizeDirective,

    MultiLinePipe,
    CallbackPipe,
    AppDurationPipe,

    DynamicFieldComponent,
    DropDownFilterComponent,
    CardComponent,
    IconComponent,
    FileUploadComponent,
    ContainerComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    DndModule,
    MomentModule,
    CommonModule,
    RouterModule,
    InViewportModule,
    AutocompleteLibModule,
    NgSelectModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    DndModule,
    MomentModule,
    NgxChartsModule,
    InViewportModule,
    NgSelectModule,
    
    StopClickDirective,
    EditableDirective,
    AutoResizeDirective,
    MultiLinePipe,
    CallbackPipe,
    AppDurationPipe,
    DynamicFieldComponent,
    DropDownFilterComponent,
    CardComponent,
    IconComponent,
    FileUploadComponent,
    ContainerComponent,
    AutocompleteLibModule
  ],
  providers: [MultiLinePipe,
    CallbackPipe,
    AppDurationPipe]
})
export class SharedModule { }
