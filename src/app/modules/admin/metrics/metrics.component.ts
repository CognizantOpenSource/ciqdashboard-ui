import { Component, OnInit } from '@angular/core';
import { UnSubscribable, EntityFilter } from 'src/app/components/unsub';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MetricsService } from 'src/app/services/auth/admin/metrics.service';

import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent extends UnSubscribable implements OnInit {
  metrics = [];
  selected = [];
  metricNameFilter = new EntityFilter('metricName');
  deleteMetricsFlag: boolean = false;
  constructor(
    private router: Router,
    private metricsService: MetricsService, private toastr: ToastrService, private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.loadMetrics();
  }
  private loadMetrics() {
    this.metricsService.getMetricsConfig().subscribe(metricsConfig => {
      this.metrics = metricsConfig;
      this.metrics.forEach((metric) => {
        metric.formulaParams = this.recurseArray(metric.formulaParams);
        metric.expanded = false;
      });
    });
  }
  recurseArray(obj) {
    var parameters = [];
    for (var key in obj) {
      var parametersObj = {};
      var item = obj[key];
      if (typeof item === "object") {
        parametersObj['key'] = key;
        parametersObj['value'] = this.recurseArray(item);
      } else {
        parametersObj['key'] = key;
        parametersObj['value'] = item;
      }

      parameters.push(parametersObj);
    }
    return parameters;
  }
  checkIfArray(obj) {
    return Array.isArray(obj);
  }
  addMetricConfig($event: MouseEvent) { this.router.navigate(['/admin/metrics/_/edit']); }

  selectionChanged($event) { this.selected = $event; }

  deleteMetrics($event: MouseEvent) {
    if (this.selected.length === 0) {
      this.toastr.warning('Please select metric to delete.');
      return;
    }
    this.deleteMetricsFlag = true;
    if (confirm(`Are you sure to delete metrics?`)) {
      this.metricsService.deleteMetrics(getMetricIds(this.selected)).subscribe(() => {
        this.toastr.success('metrics deleted successfully.');
        setTimeout(() => {
          this.deleteMetricsFlag = false;
          window.location.reload();
        }, 2000);
      }, error => {
        this.deleteMetricsFlag = false;
        console.log(error);
      });
    }
  }
}

function predicateRoleByName(role: any, name: string): boolean {
  return (!name || name === '')
    || role.name.toLowerCase().includes(name.toLowerCase());
}
function getRoleIds(roleList: any[]) {
  const roleIds = [];
  for (const roleObject of roleList) {
    roleIds.push(roleObject.name);
  }
  return roleIds;
}
function getMetricIds(metricList: any[]) {
  return metricList && metricList.map(t => t.id) || [];
}
