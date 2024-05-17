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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnSubscribable } from 'src/app/components/unsub';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DashboardItemsService, getItemFields, clean } from '../../services/ciqdashboard-items.service';
import { ToastrService } from 'ngx-toastr';
import { parseApiError } from 'src/app/components/util/error.util';
import { take } from 'rxjs/operators';
/**
* CreateImageComponent
* @author Cognizant
*/
@Component({
  selector: 'app-create-image',
  templateUrl: './create-image.component.html',
  styleUrls: ['../create-item/create-item.component.scss', './create-image.component.scss']
})
export class CreateImageComponent extends UnSubscribable implements OnInit {

  fromEditor = false;
  item: any;


  itemTypes: any[];

  options = { filters: [], columns: [], valueMap: {} };
  form: FormGroup;

  params = {
    info: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description' }], options: []
  };
  previewData;
  createMode = true;
  dashboardId:any;
  projectId:any;
  category: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private dashItemService: DashboardItemsService,
    private formBuilder: FormBuilder, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    this.managed(this.route.queryParams).pipe(take(1)).subscribe(q => {
      this.createMode = !q.itemId;
      if (this.createMode) {
        this.item = { name: 'New image', description: 'new image item' };
        ['source', 'itemGroup', 'type'].forEach(f => this.item[f] = q[f] || this.item[f]);
        this.initForm();
      } else {
        this.dashItemService.getItem(q.itemId).subscribe(item => {
          this.item = { ...item };
          this.initForm();
          this.reload();
        });
      }
    });
    this.route.params.pipe(take(1)).subscribe(qp => {
      if (qp.hasOwnProperty("dashboardId") && this.dashboardId !="") {
        this.dashboardId = qp.dashboardId;
        this.projectId = qp.projectId;
      }
    });
    this.route.queryParams.pipe(take(1)).subscribe(q => {
      if (q.hasOwnProperty("category")) {
        this.category = q.category;
      }
    });

  }
  private initForm() {
    if (this.item) {
      this.item.type = 'image';
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
  }
  reload(formValue = this.form.getRawValue()) {
    formValue.options = formValue.options || {};
    clean(formValue.options);
    this.item.dashboardId = this.dashboardId;
    this.item.layerId = this.projectId;
    this.item = { ...this.item, ...formValue };
    this.previewData = [];
  }
  updateItem() {
    if (this.category != undefined) {
      var categoryType='';
      switch(this.category){
        case 'project':{
          categoryType="PRJ";
          break;
        }
        case 'lob':{
          categoryType="LOB";
          break;
        }
        case 'org':{
          categoryType="ORG";
          break;
        }
        default:{
          categoryType="";
          break;
        }
      }
      this.item.category = categoryType;
    }
    this.item.source = '#none';
    this.item.sourceGroup ='image';
    this.item.itemGroup='dataimg';
    if (this.createMode){
      console.log('createmode');
      this.dashItemService.createItem(this.selectAggregationType({ ...this.item })).subscribe(() => this.close()
        , error => {
          const parsedError = parseApiError(error, 'error while saving item!');
          this.toastr.error(parsedError.message, parsedError.title);
        });
    }
    else {
      this.dashItemService.saveItem(this.selectAggregationType({ ...this.item })).subscribe(() => {
        this.toastr.success(`'${this.item.name || 'Item'}' saved successfully`)
      }, error => {
        const parsedError = parseApiError(error, 'error while saving data!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
    }
  }
  private selectAggregationType(item) {
    //console.log('selectedagrrete',item.activeData);
    if ((!item.activeData || item.activeData.groupBy || !item.activeData.aggregate) && item.groupBy) {
      delete item.aggregate;
    } else {
      delete item.groupBy;
    }
    return item;
  }
  close() {
    this.route.queryParams.subscribe(q => {
      if (q.hasOwnProperty("category")) {

        this.category = q.category;
      }
      if (this.route.snapshot.queryParams.returnUrl) {
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl);
      } else {
        const queryParams = { category: this.category };
        this.router.navigate(['../'], { relativeTo: this.route, queryParams });
      }
    });
  }
}
