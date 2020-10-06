import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, merge, BehaviorSubject } from 'rxjs';
import { IDashBoardApiService } from './idashboard-api.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { map, tap, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataSourceService {

  constructor(
    private api: IDashBoardApiService, private db: LocalStorage, private toastr: ToastrService) {

  }
 
  createDataSource(datasource: any): Observable<any> {
    return this.api.createdatasource(datasource);
  }

  updateDataSource(datasource: any): Observable<any> {
      return this.api.updateDataSource(datasource);
  } 
  searchdataSource(name: string): Observable<any> {
    return this.api.getDataSourceByName(name);
  }

  getcollectionName(): Observable<any> {
    return this.api.getcollectionName();
  }

  getFieldsTypes(name: string): Observable<any> {
    return this.api.getFieldsTypes(name);
  }

  deleteDataSource(id: string): Observable<any> {
    return this.api.detDataSourceByid(id);
  }

  getDataSource(id: string): Observable<any> {
    return this.api.getDataSource(id);
  }

  addExternalData(data: any, collname: string): Observable<any> {
    return this.api.addExternalData(data,collname);
  }

  UpdateExternalData(data: any, collname: string): Observable<any> {
    return this.api.updateExternalData(data,collname);
  }

}
