import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { UnSubscribable, EntityFilter } from 'src/app/components/unsub';

@Component({
  selector: 'app-options-manager',
  templateUrl: './options-manager.component.html',
  styleUrls: ['./options-manager.component.css']
})
export class OptionsManagerComponent extends UnSubscribable implements OnInit {

  autoSuggest: any = {};
  fieldIds: any = [{ name: 'docker-args', id: 'docker' }, { name: 'docker-image', id: 'docker' }, { name: 'slack-message', id: 'slack' },
  { name: 'junit-testResults', id: 'junit' }, { name: 'job-name', id: 'build-job' }, { name: 'message', id: 'print' },
  { name: 'time', id: 'sleep' }, { name: 'report-name', id: 'publishHTML' }, { name: 'environment-sonar', id: 'sonar' },
  { name: 'environment-cobertura', id: 'sonar-cobertura' },
  { name: 'environment-zap-report', id: 'sonar-zap-report' }, { name: 'cobertura-report-file', id: 'jenkins-cobertura' }];
  items: any = [];
  fieldSelected = [];
  itemSelected = [];
  itemFilter = new EntityFilter('name');
  fieldFilter = new EntityFilter('name');
  isNewAutoSuggest = false;

  constructor(private route: ActivatedRoute,
    private location: Location, private toastr: ToastrService, ) {
    super();
  }

  ngOnInit() {
    if (history.state.autoSuggest) {
      this.setAutoSuggest(history.state.autoSuggest);
    } 
  }
  setAutoSuggest(autoSuggest) {
    if (autoSuggest) {
      this.autoSuggest = autoSuggest;
      this.isNewAutoSuggest = this.autoSuggest.fieldIds.length === 0;
      this.fieldSelected = this.fieldIds.filter(field => autoSuggest.fieldIds.find(o2 => field.name === o2));
      this.items = autoSuggest.items.map((item) => ({ name: item }));
    } else { this.location.back(); }
  }
  fieldSelectionChanged($event) {
    this.fieldSelected = $event;
  }
  addItem() {
    this.items.push({ name: 'New Item' });
  }
  deleteItem(index) {
    if (confirm(`Are you sure to delete item?`)) {
      this.items.splice(index, 1);
    }
  }
  updateOptions($event: MouseEvent) {
    this.autoSuggest.items = this.items.map(item => item.name);
    this.autoSuggest.fieldIds = this.fieldSelected.map(field => field.name);
    if (this.autoSuggest.fieldIds.length === 0) {
      this.toastr.warning('please select atleast one field');
    } else if (this.autoSuggest.items.length === 0) {
      this.toastr.warning('please select atleast one item');
    } 
  }
  private afterSave(res: any) {
    this.toastr.success('auto suggests saved successfully');
    this.isNewAutoSuggest = false;
  }
  close($event: MouseEvent) {
    if (this.isNewAutoSuggest) {
      if (confirm(`please apply before close or changes will be lost. Are you sure to close?`)) {
        this.location.back();
      }
    } else { this.location.back(); }
  }
}
