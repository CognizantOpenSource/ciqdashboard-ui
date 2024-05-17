
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  constructor(private http: HttpClient) {
  }


  getDashboardTemplates(): Observable<any> {
    return this.http.get<any[]>(environment.api.idashboard + 'dashboard-template/get-all-templates/');
  }
}
