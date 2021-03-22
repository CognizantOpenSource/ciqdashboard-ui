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
@Component({
  selector: 'app-create-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['../create-item/create-item.component.scss', './create-label.component.scss']
})
export class CreateLabelComponent extends UnSubscribable implements OnInit {

  fromEditor = false;
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

  constructor(private route: ActivatedRoute, private router: Router, private dashItemService: DashboardItemsService,
    private formBuilder: FormBuilder, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    this.managed(this.route.queryParams).pipe(take(1)).subscribe(q => {
      this.createMode = !q.itemId;
      if (this.createMode) {
        this.item = { name: 'New Label', description: 'new label item' };
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

  }
  private initForm() {
    if (this.item) {
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
    if (this.route.snapshot.queryParams.returnUrl) {
      this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl);
    } else
      this.router.navigate(['../'], { relativeTo: this.route });
  }
}
