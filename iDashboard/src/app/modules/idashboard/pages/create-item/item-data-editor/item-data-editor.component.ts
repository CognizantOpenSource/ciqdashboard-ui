import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ObjectUtil } from 'src/app/components/util/object.util';
import { ToastrService } from 'ngx-toastr';
import { getItemFields, getItemGroupBy } from '../../../services/idashboard-items.service';

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
  groupByControls: any[];
  projectionControls: any[];
  params = {
    info: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description' }], options: []
  };
  groupByConfig = defGroupByConfig;

  item;
  @Input('item') set setItem(item) {
    this.item = item;
    if (item)
      this.initForm(this.item);
  }
  @Input() fields;
  @Input('type') set setType(type) {
    this.setItemType(type);
  }

  @Input() filterOptions;
  @Output() itemChange = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();
  types = { item: { table: 'table' } };
  dataOpen = {
    groupBy: false, aggregate: false
  }
  constructor(private toastr: ToastrService, private formBuilder: FormBuilder) { }

  ngOnInit() {

  }
  setItemType(type) {
    if (type && this.item) {
      this.item.type = type;
      this.params.options = getItemFields(this.item.type);
      this.groupByConfig = getItemGroupBy(this.item.type) || defGroupByConfig;
    }
  }
  getOptions(item) {
    let opts = item.options || { legendPositionDown: true };
    opts = this.params.options.reduce((a, e) => ({ ...a, [e.name]: opts[e.name] }),);
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
    if (this.groupByConfig , this.groupByControls) {
      this.groupByControls.splice(0, this.groupByControls.length);
      for (let i = 0; i < this.groupByConfig.maxFields; i++) {
        this.add(i, this.groupByControls, this.groupByConfig.maxFields);
        this.groupByControls[i].setValue(values[i] || '');
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
  activeChange
  updated(name, data) {
    const formValue = this.form.getRawValue();
    this.item[name] = formValue[name];
    this.item.options = formValue.options; 
  }

}

