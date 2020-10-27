import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ObjectUtil } from 'src/app/components/util/object.util';
import { ToastrService } from 'ngx-toastr';
import { getItemAggregate, getItemFields, getItemGroupBy } from '../../../services/idashboard-items.service';
import { Subscription } from 'rxjs';
import { resetDisabledFieldsInOptions } from '../../../components/item-options-editor/item-options-editor.component';
import { suffledColors } from '../../../services/items.data';

function add(index, controls: any[], ...args) {
  if (index == controls.length - 1) {
    controls.push(new FormControl(''));
  } else
    ObjectUtil.insert(controls, new FormControl('', Validators.minLength(1)), index + 1);
}
function remove(index, controls) {
  controls.splice(index, 1);
}
export const defGroupByConfig = {
  "minFields": 1,
  "maxFields": 3,
  "fields": [{ "name": "Level 1", "required": true }, { "name": "Level 2" }, { "name": "Level 3" }]
}
@Component({
  selector: 'item-data-editor',
  templateUrl: './item-data-editor.component.html',
  styleUrls: ['../create-item.component.scss', './item-data-editor.component.scss']
})
export class ItemDataEditorComponent implements OnInit {


  form: FormGroup;
  formChanges: Subscription;
  groupByControls: any[];
  projectionControls: any[];
  params = {
    info: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description' }], options: []
  };
  groupByConfigs = [defGroupByConfig];
  groupByConfig = this.groupByConfigs[0]

  item;
  @Input('item') set setItem(item) {
    this.item = item;
    if (item)
      this.initForm(this.item);
  }
  @Input() fields: any[];
  @Input('type') set setType(type) {
    this.setItemType(type);
  }

  @Input() filterOptions;
  @Output() itemChange = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();
  types = { item: { table: 'table', comboChart: 'combo' } };
  dataOpen = {
    groupBy: false, aggregate: false
  }
  hasAggregate;
  disabledOptions: { [key: string]: boolean };
  constructor(private toastr: ToastrService, private formBuilder: FormBuilder) { }

  ngOnInit() {

  }
  setItemType(type) {
    if (type && this.item) {
      this.item.type = type;
      this.params.options = getItemFields(this.item.type);
      this.groupByConfigs = getItemGroupBy(this.item.type) && getItemGroupBy(this.item.type) || [defGroupByConfig];
      this.groupByConfig = this.groupByConfigs[0];
      this.hasAggregate = getItemAggregate(this.item.type);
    }
  }
  getOptions(item) {
    let opts = item.options || { legendPositionDown: true };
    opts = this.params.options.reduce((a, e) => ({ ...a, [e.name]: opts[e.name] }), {});
    opts.title = opts.title || item.name || 'New Item';
    return opts;
  }
  initForm(item = {} as any, formBuilder = this.formBuilder) {
    this.setItemType(item.type);
    const intemInfo = {};
    for (const param of this.params.info) {
      intemInfo[param.name] = [item[param.name] || '', [Validators.required]];
    }
    this.item.activeData = this.dataOpen;
    this.item.options = this.getOptions(item);
    this.form = formBuilder.group({
      ...intemInfo,
      options: [item.options, []],
      groupBy: new FormArray((item.groupBy || []).map(f => new FormControl(f))),
      projection: new FormArray((item.projection || []).map(f => new FormControl(f)))
    });
    this.groupByControls = (this.form.get('groupBy') as FormArray).controls;
    this.projectionControls = (this.form.get('projection') as FormArray).controls;
    this.updateGroupByControls();
  }
  updateGroupByControls() {
    const values = this.groupByControls.map(c => c.value);
    if (this.groupByConfig && this.groupByControls) {
      this.groupByControls.splice(0, this.groupByControls.length);
      for (let i = 0; i < this.groupByConfig.maxFields; i++) {
        this.add(i, this.groupByControls, this.groupByConfig.maxFields);
        this.groupByControls[i].setValue(values[i] || '');
        setTimeout(() => {
          // update in background
          this.updateFieldOptions(values[i] , i , this.groupByConfig);
        }, 1000);
      }
    }
  }
  add(index, controls: any[], limit = 0) {
    if (limit && controls.length >= limit) {
      this.toastr.warning(`maximum ${limit} values can be added`);
      return;
    }
    add(index, controls);
  }
  remove(index, controls: any[], limit = 0) {
    // TODO: verify if field is required before remove
    if (limit && controls.length <= limit) {
      this.toastr.warning(`minimum required values ${limit}`);
      return;
    }
    remove(index, controls);
  }

  updated(name, data) {
    const formValue = this.form.getRawValue();
    this.item[name] = formValue[name];
    this.item.options = { ...(name == 'options' ? data : formValue.options) };
  }
  groupByChange(value, index, config) {
    this.updated('groupBy', value);
    this.updateFieldOptions(value, index, config);
  }
  private updateFieldOptions(fieldName, index, config) {
    let dateSeries = !!(this.disabledOptions && this.disabledOptions.dateSeries);
    if (fieldName && index >= 0 && config && config.fields) {
      const isSeriesField = ['X Axis', 'Y Axis'].includes(config.fields[index].name) || config.fields.length === 1;
      if (isSeriesField) {
        const field = this.fields && this.fields.find(f => f.name == fieldName);
        dateSeries = field && field.type !== 'date';
      }
    }
    this.disabledOptions = { ...(this.disabledOptions || {}), dateSeries };
    setTimeout(() => {
      resetDisabledFieldsInOptions(this.item.options, this.disabledOptions);
    }, 10);
  }
}

