import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnSubscribable } from 'src/app/components/unsub';
import { DashboardService } from '../../services/idashboard.service';
import { FilterOps } from '../../services/filter-ops';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DashboardItemsService, getItemFields, clean } from '../../services/idashboard-items.service';
import { ToastrService } from 'ngx-toastr';
import { parseApiError } from 'src/app/components/util/error.util';
const pages = { updateOptions: 'Item Options' };  //we dont need item source
@Component({
  selector: 'leap-create-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['../create-item/create-item.component.scss', './create-label.component.scss']
})
export class CreateLabelComponent extends UnSubscribable implements OnInit {

  fromEditor = false;
  navs = [];
  item: any;

  datasets: any[];
  itemTypes: any[];

  options = { filters: [], columns: [], valueMap: {} };
  form: FormGroup;

  params = {
    info: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description' }], options: []
  };
  previewData;
  createMode = true;

  constructor(private route: ActivatedRoute, private router: Router, spec: FilterOps,
    private dashboardService: DashboardService, private dashItemService: DashboardItemsService,
    private formBuilder: FormBuilder, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {

    this.dashItemService.getDataSources().subscribe(ds => this.datasets = ds.map(it => ({ ...it, desc: it.toolName, })));
    this.managed(this.route.params).subscribe(params => {
      this.createMode = !params.itemId;
      this.fromEditor = !!params.item;
      if (this.fromEditor) {
        this.item = { name: 'New Label', description: 'new label item', filters: [], groupBy: [], projection: [] }
      };
    });
    this.item.type = 'label';
    this.params.options = getItemFields(this.item.type);
    const intemInfo = {};
    for (const param of this.params.info) {
      intemInfo[param.name] = [this.item[param.name] || '', [Validators.required]];
    }
    this.form = this.formBuilder.group({
      ...intemInfo,
      options: [this.item.options || {}, []],
    });
  }

  getItemsFilter(searchBy) {
    const context = this;
    return (item: any) => !context[searchBy] ? true : item.name.includes(context[searchBy]);
  }
  private updateRouteQueryParam(queryParams) {
    this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }

  onCrumClick(index, navs = this.navs) {
    navs.splice(index + 1);
    this.updateRouteQueryParam({ navs });
  }

  reload(formValue = this.form.getRawValue()) {
    formValue.options = formValue.options || {};
    clean(formValue.options);
    this.item = { ...this.item, ...formValue };
    this.previewData = [];
  }
  optionsChange(opts) {
    this.item.options = { ...opts };
  }
  updateItem() {
    if (this.createMode)
      this.dashItemService.createItem({ ...this.item, source: '#none', sourceGroup: 'label', itemGroup: 'datalabel' }).subscribe(() => this.close()
        , error => {
          const parsedError = parseApiError(error, 'error while saving item!');
          this.toastr.error(parsedError.message, parsedError.title);
        });
    else {
      this.dashItemService.saveItem(this.item).subscribe(() => this.close(), error => {
        const parsedError = parseApiError(error, 'error while saving data!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
    }
  }
  close() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  add(index, controls: any[], limit = 0) {
    if (limit && controls.length >= limit) {
      this.toastr.warning(`maximum ${limit} values can be added`);
      return;
    }
  }

}
