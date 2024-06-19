
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  metricHost = "";
  idashboardHost=";"
  constructor(private http: HttpClient) {
    this.metricHost = environment.api.metric;
    this.idashboardHost = environment.api.idashboard;
  }

  saveMetricConfig(metricConfig): Observable<any> {
    return this.http.post(this.metricHost + 'api/metrics/save-metric-config', metricConfig);
  }

  updateMetricConfig(metricConfig): Observable<any> {
    return this.http.put(this.metricHost + 'api/metrics/update-metric-config', metricConfig);
  }

  getMetricsConfigByID(id): Observable<any> {
    return this.http.get<any[]>(this.metricHost + 'api/metrics/metric-config/' + id);
  }
  getMetricsConfig(): Observable<any> {
    return this.http.get<any[]>(this.metricHost + 'api/metrics/metric-config');
  }

  getMetricsNames(): Observable<any> {
    return this.http.get<any[]>(this.metricHost + 'api/metrics/metric-names');
  }
  deleteMetrics(metrics): Observable<any> {
    let ids: Array<string> = Array();
    ids.push(...metrics);
    return this.http.delete(this.metricHost + 'api/metrics/metric-config?id='+ids.toString());
  }
  getDataSources(): Observable<any> {
    return this.http.get<any[]>(this.idashboardHost + 'data-sources/');
  }
  getMetricCategory(): Observable<any> {
    return this.http.get<any[]>(this.idashboardHost + 'metricDropdowns/?dropDownCode=Category');
  }
  getMetricCustomName(): Observable<any> {
    return this.http.get<any[]>(this.idashboardHost + 'metricDropdowns/?dropDownCode=Custom_Function_Name');
  }
  getMetricCalculationType(): Observable<any> {
    return this.http.get<any[]>(this.idashboardHost + 'metricDropdowns/?dropDownCode=Calculation_Type');
  }
  getMetricTrendField(): Observable<any> {
    return this.http.get<any[]>(this.idashboardHost + 'metricDropdowns/?dropDownCode=TrendBy_Values');
  }
  getMetricFunction(): Observable<any> {
    return this.http.get<any[]>(this.idashboardHost + 'metricDropdowns/?dropDownCode=Function_Name');
  }
}
