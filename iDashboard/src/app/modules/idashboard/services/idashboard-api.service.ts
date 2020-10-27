import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'; 
import { environment } from 'src/environments/environment';
import { IDashboardAPI } from './api';
import { itemTypes } from './items.data'; 

@Injectable({
  providedIn: 'root'
})
export class IDashBoardApiService {

  getProjectMapping(projectId):Observable<any>{
    return this.http.get(this.api.getProjectMapping(projectId));
  }
  getTeamsProjects(teamId):Observable<any>{
    return this.http.get(this.api.getTeam(teamId));
  }
  updateTeamsProjects(teamId , projectIds:string[]):Observable<any>{
    return this.http.put(this.api.getTeam(teamId) , projectIds);
  }
  deleteTeamsProject(teamId , projectId):Observable<any>{
    return this.http.delete(this.api.getTeamsProject(teamId , projectId));
  }
  getDashboardsItems(): Observable<any> {
    return this.http.get(this.api.items);
  }
  getItem(id): Observable<any> {
    return this.http.get(this.api.getItem(id));
  }
  createItem(item): Observable<any> {
    return this.http.post(this.api.items, item);
  }
  putItem(item): Observable<any> {
    return this.http.put(this.api.items, item);
  }
  deleteItem(id): Observable<any> {
    return this.http.delete(this.api.getItem(id));
  }
  getItemData(id, options): Observable<any> {
    return this.http.post(this.api.getItemData(id), options);
  }
  previewItem(item: any): Observable<any> {
    return this.http.post(this.api.previewItem, item);
  }
  searchItem(keywords): Observable<any> {
    return this.http.get(this.api.searchItems(keywords));
  }
  getSourceInfo(source: any): Observable<any> {
    return this.http.get(this.api.getSourceInfo(source));
  }
  getDataSources(): Observable<any> {
    return this.http.get(this.api.dataSources);
  }
  getFieldValues(source, field): Observable<any> {
    return this.http.get(this.api.getFieldValues(source, field));
  }
  getItemTypes(): Observable<any> {
    return of(itemTypes);
  }
  getDashboardByName(name: string): Observable<any> {
    return this.http.get(this.api.searchDashboard(name));
  }
  postDashboard(dashboard: any): Observable<any> {
    return this.http.post(this.api.dashboards, dashboard);
  }
  putDashBoard(dashboard: any): Observable<any> {
    return this.http.put(this.api.dashboards, dashboard);
  }
  deleteDashboard(id: string): Observable<any> {
    return this.http.delete(this.api.getDashboard(id));
  }

  getDashboards(id: any): Observable<any> {
    return this.http.get(this.api.getDashboards(id));
  }

  getDashboard(id: string): Observable<any> {
    return this.http.get(this.api.getDashboard(id));
  }

  putProject(project: any) {
    return this.http.put(this.api.projects, project);
  }
  postProject(project: any): Observable<any> {
    return this.http.post(this.api.projects, project);
  }
  getProjectByName(name: string): Observable<any> {
    return this.http.get(this.api.searchProject(name));
  }
  deleteProject(project: any): Observable<any> {
    return this.http.delete(this.api.getProject(project));
  }
  getProject(id: string): Observable<any> {
    return this.http.get(this.api.getProject(id));
  }
  getProjects(): Observable<any> {
    return this.http.get(this.api.projects);
  }
  getUserSettings(): Observable<any> {
    return this.http.get(this.api.userSettings);
  }
  putUserSettings(settings: any): Observable<any> {
    return this.http.put(this.api.userSettings, settings);
  }
  getSystemSettings(): Observable<any> {
    return this.http.get(this.api.systemSettings);
  }
  reloadWhitelist(): Observable<any> {
    return this.http.post(this.api.reloadWhitelist, null);
  }

  // Data Source Module Releated Services

  createdatasource(datasource: any): Observable<any> {
    return this.http.post(this.api.datasource, datasource);
  }

  updateDataSource(datasource: any): Observable<any> {
    return this.http.put(this.api.datasource, datasource);
  }

  getDataSource(id: string): Observable<any> {
    return this.http.get(this.api.getDataSource(id))
  }

  detDataSourceByid(id: string): Observable<any> {
    return this.http.delete(this.api.detDataSourceByid(id))
  }


  getDataSourceByName(name: string): Observable<any> {
    return this.http.get(this.api.searchDatasource(name));
  }

  getcollectionName(): Observable<any> {
    return this.http.get(this.api.getcollectionName());
  }

  getFieldsTypes(name: string): Observable<any> {
    return this.http.get(this.api.getFieldsTypes(name));
  }

  addExternalData(data: any, collname: string): Observable<any> {
    collname = collname.trim();
    let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json','Cache-Control': 'no-cache'}); 
    const options = {headers: httpHeaders, params: new HttpParams().set('collectionName', collname) };
    return this.http.post(this.api.addExtdata,data,options);
  }

  updateExternalData(data: any, collname: string): Observable<any> {
    collname = collname.trim();
    let httpHeaders = new HttpHeaders({'Content-Type' : 'application/json','Cache-Control': 'no-cache'}); 
    const options = {headers: httpHeaders, params: new HttpParams().set('collectionName', collname).set('override' , 'true')};
    return this.http.put(this.api.updateExtdata,data,options);
  }

  api: IDashboardAPI;
  constructor(private http: HttpClient) {
    this.api = new IDashboardAPI(environment.api.idashboard);
  }

}