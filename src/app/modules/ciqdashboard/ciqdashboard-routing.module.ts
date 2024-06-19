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
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth/auth-guard.service';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ProjectHomeComponent } from './pages/project-home/project-home.component';
import { NewLOBComponent } from './pages/new-lob/new-lob.component';
import { LOBHomeComponent } from './pages/lob-home/lob-home.component';
import { NewORGComponent } from './pages/new-org/new-org.component';
import { ORGHomeComponent } from './pages/org-home/org-home.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { DashboardEditorComponent } from './pages/dashboard-editor/dashboard-editor.component';
import { CreateItemComponent } from './pages/create-item/create-item.component';
import { DashboardSlideshowComponent } from './pages/dashboard-slideshow/dashboard-slideshow.component';
import { CreateLabelComponent } from './pages/create-label/create-label.component';
import { CreateImageComponent } from './pages/create-image/create-image.component';
import { SearchChartComponent } from './pages/search-chart/search-chart.component';
/**
* ExecutionRoutingModule
* @author Cognizant
*/

const routes: Routes = [
  { path: '', redirectTo: 'orgs', pathMatch: 'full' },
  {
    path: 'smart-dashboard', component: SearchChartComponent, canActivate: [AuthGuard]
  },
  {
    path: 'orgs', component: ORGHomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'orgs/new', component: NewORGComponent, canActivate: [AuthGuard]
  },

  /* {
    path: ':orgId', component: WrapperComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboards', pathMatch: 'full' },
      {
        path: 'dashboards',
        children: [
          { path: '', component: DashboardHomeComponent, data: { title: 'DashBoards' }, },
          { path: ':dashboardId', component: DashboardHomeComponent, data: { title: 'DashBoards' } },
          { path: ':dashboardId/slideshow', component: DashboardSlideshowComponent, data: { title: 'Slide-Show' } },
          {
            path: ':dashboardId/edit/:item', component: DashboardEditorComponent, data: { title: 'Edit DashBoard Item' },
            children: [
              { path: 'create-chart', component: CreateItemComponent, data: { title: 'New Item' }, },
              { path: 'create-label', component: CreateLabelComponent, data: { title: 'New Label' }, },
              { path: 'create-img', component: CreateImageComponent, data: { title: 'New Image' }, },
              { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, },
              { path: 'edit-label', component: CreateLabelComponent, data: { title: 'Edit Label' }, },
              { path: 'edit-img', component: CreateImageComponent, data: { title: 'Edit Image' }, },
            ],
          },
          {
            path: ':dashboardId/edit', redirectTo: ':dashboardId/edit/', pathMatch: 'full',
          },
        ]
      },
      { path: 'create-chart', component: CreateItemComponent, data: { title: 'Create Item' }, },
      { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, },
      { path: 'edit-label', component: CreateLabelComponent, data: { title: 'Edit Label' }, },
      { path: 'edit-img', component: CreateImageComponent, data: { title: 'Edit Image' }, },

    ]
  }, */
  {
    path: 'lobs', component: LOBHomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'lobs/new', component: NewLOBComponent, canActivate: [AuthGuard]
  },

  /* {
    path: ':lobId', component: WrapperComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboards', pathMatch: 'full' },
      {
        path: 'dashboards',
        children: [
          { path: '', component: DashboardHomeComponent, data: { title: 'DashBoards' }, },
          { path: ':dashboardId', component: DashboardHomeComponent, data: { title: 'DashBoards' } },
          { path: ':dashboardId/slideshow', component: DashboardSlideshowComponent, data: { title: 'Slide-Show' } },
          {
            path: ':dashboardId/edit/:item', component: DashboardEditorComponent, data: { title: 'Edit DashBoard Item' },
            children: [
              { path: 'create-chart', component: CreateItemComponent, data: { title: 'New Item' }, },
              { path: 'create-label', component: CreateLabelComponent, data: { title: 'New Label' }, },
              { path: 'create-img', component: CreateImageComponent, data: { title: 'New Image' }, },
              { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, },
              { path: 'edit-label', component: CreateLabelComponent, data: { title: 'Edit Label' }, },
              { path: 'edit-img', component: CreateImageComponent, data: { title: 'Edit Image' }, },
            ],
          },
          {
            path: ':dashboardId/edit', redirectTo: ':dashboardId/edit/', pathMatch: 'full',
          },
        ]
      },
      { path: 'create-chart', component: CreateItemComponent, data: { title: 'Create Item' }, },
      { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, },
      { path: 'edit-label', component: CreateLabelComponent, data: { title: 'Edit Label' }, },
      { path: 'edit-img', component: CreateImageComponent, data: { title: 'Edit Image' }, },

    ]
  }, */
  {
    path: 'projects', component: ProjectHomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'projects/new', component: NewProjectComponent, canActivate: [AuthGuard]
  },

  {
    path: ':projectId', component: WrapperComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboards', pathMatch: 'full' },
      {
        path: 'dashboards',
        children: [
          { path: '', component: DashboardHomeComponent, data: { title: 'DashBoards' }, },
          { path: ':dashboardId', component: DashboardHomeComponent, data: { title: 'DashBoards' } },
          { path: ':dashboardId/slideshow', component: DashboardSlideshowComponent, data: { title: 'Slide-Show' } },
          {
            path: ':dashboardId/edit/:item', component: DashboardEditorComponent, data: { title: 'Edit DashBoard Item' },
            children: [
              { path: 'create-chart', component: CreateItemComponent, data: { title: 'New Item' }, },
              { path: 'create-label', component: CreateLabelComponent, data: { title: 'New Label' }, },
              { path: 'create-img', component: CreateImageComponent, data: { title: 'New Image' }, },
              { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, },
              { path: 'edit-label', component: CreateLabelComponent, data: { title: 'Edit Label' }, },
              { path: 'edit-img', component: CreateImageComponent, data: { title: 'Edit Image' }, },
            ],
          },
          {
            path: ':dashboardId/edit', redirectTo: ':dashboardId/edit/', pathMatch: 'full',
          },
        ]
      },
      { path: 'create-chart', component: CreateItemComponent, data: { title: 'Create Item' }, },
      { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, },
      { path: 'edit-label', component: CreateLabelComponent, data: { title: 'Edit Label' }, },
      { path: 'edit-img', component: CreateImageComponent, data: { title: 'Edit Image' }, },

    ]
  },
  {
    path: 'create-chart', component: CreateItemComponent, canActivate: [AuthGuard], data: { title: 'Create Item' }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutionRoutingModule { }
