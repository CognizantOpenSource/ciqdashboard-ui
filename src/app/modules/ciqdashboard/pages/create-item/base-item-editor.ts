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
import { FilterableDashboardComponent } from '../../components/filterable-dash-component';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FilterOps } from '../../services/filter-ops';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
/**
* BaseItemEditor
* @author Cognizant
*/
export const pages = { selectSource: 'Data Source', selectType: 'Item Type', updateOptions: 'Item Options' };
export class BaseItemEditor extends FilterableDashboardComponent<any> {

    filterDataby;
    filterItemby;
    options = { filters: [], columns: [], valueMap: {} };

    item: any;

    previewData;
    datasets: any[];
    itemTypes: any[];
    category = "";

    constructor(public route: ActivatedRoute, public router: Router, spec: FilterOps, public toastr: ToastrService) {
        super(spec);
    }
    updateRouteQueryParam(queryParams) {
        this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
    }
    processTypeUpdate(type) {
        this.previewData = null;
        this.item.type = type;
        if (!this.item.name || ['New Item', 'New Chart', ''].includes(this.item.name)) {
            this.item.name = type === 'table' ? 'New Table' : 'New Chart';
        }
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