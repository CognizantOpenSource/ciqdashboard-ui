import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth/auth-guard.service';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ProjectHomeComponent } from './pages/project-home/project-home.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { DashboardEditorComponent } from './pages/dashboard-editor/dashboard-editor.component';
import { CreateItemComponent } from './pages/create-item/create-item.component';
import { DashboardSlideshowComponent } from './pages/dashboard-slideshow/dashboard-slideshow.component';
import { CreateLabelComponent } from './pages/create-label/create-label.component';
import { CreateImageComponent } from './pages/create-image/create-image.component';
import { SearchChartComponent } from './pages/search-chart/search-chart.component';


const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'smart-dashboard', component: SearchChartComponent, canActivate: [AuthGuard]
  },
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
              { path: 'create-label', component: CreateLabelComponent, data: { title: 'New Item' }, },
              { path: 'create-img', component: CreateImageComponent, data: { title: 'New Item' }, },  
              { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, }, 
            ],
          },
          {
            path: ':dashboardId/edit', redirectTo: ':dashboardId/edit/', pathMatch: 'full',
          },
        ]
      },
      { path: 'create-chart', component: CreateItemComponent, data: { title: 'Create Item' }, },
      { path: 'edit-chart', component: CreateItemComponent, data: { title: 'Edit Item' }, },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutionRoutingModule { }
