import { FilterableDashboardComponent } from '../../components/filterable-dash-component';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FilterOps } from '../../services/filter-ops';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

export const pages = { selectSource: 'Data Source', selectType: 'Item Type', updateOptions: 'Item Options' };
export class BaseItemEditor extends FilterableDashboardComponent<any> {

    filterDataby;
    filterItemby;
    options = { filters: [], columns: [], valueMap: {} };

    item: any;

    previewData;
    datasets: any[];
    itemTypes: any[];

    constructor(public route: ActivatedRoute, public router: Router, spec: FilterOps, public toastr: ToastrService) {
        super(spec);
    }
    getItemsFilter(searchBy) {
        const context = this;
        return (item: any) => !context[searchBy] ? true : item.name.includes(context[searchBy]);
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
        if (this.route.snapshot.queryParams.returnUrl) {
            this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl);
        } else
            this.router.navigate(['../'], { relativeTo: this.route });
    }
}