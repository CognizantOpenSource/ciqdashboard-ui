import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ObjectUtil } from 'src/app/components/util/object.util';
import { ToastrService } from 'ngx-toastr';
import { getItemAggregate, getItemFields, getItemGroupBy } from '../../../services/idashboard-items.service';
import { Subscription } from 'rxjs';
import { resetDisabledFieldsInOptions } from '../../../components/item-options-editor/item-options-editor.component';

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
  minFields: 1, maxFields: 3,
  fields: [{ name: "Level 1", required: true, gIndex: 0 }, { name: "Level 2", gIndex: 1 }, { name: "Level 3", gIndex: 2 }]
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
  fields: any[];
  aggregateFields: any[];
  @Input('fields') set setFields(fields: any[]) {
    this.fields = fields;
    this.aggregateFields = fields && fields.filter(f => !['array', 'object'].includes((f.type || '').toLowerCase()));
  }
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
  disabledOptions: { [key: string]: boolean } = {};
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
    const values = this.groupByControls.map(c => c.value).filter(v => v && v !== '');
    if (this.groupByConfig && this.groupByControls) {
      this.groupByControls.splice(0, this.groupByControls.length);
      const fieldsToUdDate = Math.min(this.groupByConfig.maxFields, Math.max(this.groupByConfig.minFields, values.length));
      for (let i = 0; i < fieldsToUdDate; i++) {
        this.add(i, this.groupByControls, this.groupByConfig.maxFields);
        this.groupByControls[i].setValue(values[i] || '');
        setTimeout(() => {
          // update options in background
          const fieldIndex = this.groupByConfig.fields.indexOf(this.groupByConfig.fields.find(f => f.gIndex === i));
          this.updateFieldOptions(values[i], fieldIndex, this.groupByConfig);
        }, 1000);
      }
    }
  }
  add(index, controls: any[], limit = 3) {
    if (limit > 0 && controls.length >= limit) {
      this.toastr.warning(`maximum ${limit} values can be added`);
      return;
    }
    add(index, controls);
  }
  remove(index, controls: any[], limit = 1) {
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
    // store disabled states for the options in dash edit page
    Object.keys(this.disabledOptions).filter(opt => this.disabledOptions[opt] === true).forEach(option => {
      this.item.options[`${option}--disabled`] = true;
    })
  }
  groupByChange(value, index, config) {
    const { groupBy } = this.form.getRawValue();
    this.updated('groupBy', groupBy);
    this.item.groupBy = groupBy && groupBy.filter(v => v && v !== '');
    this.updateFieldOptions(value, index, config);
  }
  private updateFieldOptions(fieldName, index, config) {
    if (fieldName && index >= 0 && config && config.fields) {
      const isSeriesField = ['X Axis', 'Y Axis'].includes(config.fields[index].name) || config.fields.length === 1;
      if (isSeriesField) {
        const field = this.fields && this.fields.find(f => f.name == fieldName);
        this.disabledOptions.dateSeries = (field && field.type || '').toLowerCase() !== 'date';
      }
    }
    this.disabledOptions = { ...(this.disabledOptions || {}) };
    setTimeout(() => {
      resetDisabledFieldsInOptions(this.item.options, this.disabledOptions);
    }, 10);
  }
}

