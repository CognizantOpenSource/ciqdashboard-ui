import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterOps } from '../../services/filter-ops';
import { DashboardItemsService, clean } from '../../services/idashboard-items.service';
import { ToastrService } from 'ngx-toastr';
import { parseApiError } from 'src/app/components/util/error.util';
import { DashboardDataSourceService } from "../../services/idashboard-datasource.service";
import { BaseItemEditor, pages } from './base-item-editor';
import * as csv from 'csvtojson';
import { take } from 'rxjs/operators';

interface DataSoure {
  id: string;
  name: string;
}

@Component({
  templateUrl: './create-item.component.html',
  styleUrls: ['./../../components/idashboard.scss', './create-item.component.scss']
})
export class CreateItemComponent extends BaseItemEditor implements OnInit {

  // DataSource Variables

  datasourceId: string;
  title: string;
  isEdit: boolean;
  isAdd: boolean;

  opendtswin = false;
  opendtsdelwin = false;
  opendtsdeldlg = false;

  isSelected: boolean = false;

  icon: string;
  isCustomlabelDuplicate: boolean;

  @ViewChild('aForm', { static: false }) aForm: ElementRef;


  collectionNames: any;
  ItemsCol: any;


  dtname: string;
  dtgroup: string;
  dtcollectionname: string;
  dtdesc: string;
  dttoolname: string;
  selected: any;

  duplicateDatasource = {
    state: false,
    value: ''
  };

  _datasource = {};
  @Input() set datasource(datasource: any) {
    this._datasource = datasource;
  }
  get datasource(): any {
    return this._datasource;
  }

  //End of DataSource Variables

  // Upload External Data
  check: boolean;
  updatecollectionname: string;
  openuploadwin = false;
  jsondata: any;

  // End of Upload External Data

  createMode = true;
  navs = [];

  constructor(
    route: ActivatedRoute, router: Router, spec: FilterOps, toastr: ToastrService,
    private dashItemService: DashboardItemsService, private datasoruceService: DashboardDataSourceService
  ) {
    super(route, router, spec, toastr);

  }


  ngOnInit() {
    super.setOptions(this.options);
    this.loadDataSources();
    this.loadCollectionsName();
    const pageNames = Object.keys(pages).map(k => pages[k]);

    this.managed(this.route.queryParams).subscribe(q => {
      const nav = q.navs || pages.selectSource;
      this.navs = (nav instanceof Array ? nav : [nav]).filter(p => !!pageNames.includes(p));
    });
    this.route.queryParams.pipe(take(1)).subscribe(q => {
      const nav = q.navs || pages.selectSource;
      this.navs = (nav instanceof Array ? nav : [nav]).filter(p => !!pageNames.includes(p));
      this.createMode = !q.itemId;
      if (this.createMode) {
        this.item = { name: 'New Item', description: 'new item', filters: [], groupBy: [], projection: [] };
        ['source', 'itemGroup', 'type'].forEach(f => this.item[f] = q[f] || this.item[f]);
        if (this.item.name == 'New Item') {
          this.item.name = q.itemGroup === 'datatable' ? 'New Table' : 'New Chart';
        }
        this.loadSourceInfo(this.item.source);
        this.processTypeUpdate(this.item.type);
      } else {
        this.dashItemService.getItem(q.itemId).subscribe(item => {
          this.item = { ...item };
          this.filters = item.filters || [];
          this.loadSourceInfo(this.item.source);
          this.processTypeUpdate(this.item.type);
          this.reload();
        });
      }
      this.dashItemService.getItemTypes().subscribe(items => this.setItemTypes(q.itemGroup, items));
    }); 
  }
  private setItemTypes(itemGroup: string, items: any[]) {
    if (items) {
      if (itemGroup !== 'datatable') {
        const excludes = ['label', 'image' , 'table']; 
      this.itemTypes = items.filter(i => !excludes.includes(i.name)).map(it => ({ ...it, desc: (it.desc || it.name + ' chart item') }));
      }else{
        this.itemTypes =  items.filter(i => i.name === 'table').map(it => ({ ...it, desc: (it.desc || it.name + ' chart item')  }));
      }
    }
  }
  private loadDataSources() {
    this.dashItemService.getDataSources().subscribe(ds => this.datasets = ds.map(it => ({ ...it, desc: it.toolName, })));
  }

  private loadCollectionsName() {
    // Get All Collection Names
    this.datasoruceService.getcollectionName().subscribe((values) => {
      this.collectionNames = values;
    });
  }

  private loadSourceInfo(source) {
    if (source)
      this.dashItemService.getSourceInfo(source).subscribe(info => {
        this.options.columns = info.fields.filter(f => f.name[0] !== '_').
          map(f => ({ ...f, label: f.label || f.name }));
        this.item.sourceGroup = info.group;
        this.options.valueMap = this.options.valueMap || {};
        super.setOptions(this.options);
      });
  }
  onFiledSelected(field) {
    if (!this.options.valueMap[field]) {
      this.dashItemService.getFieldValues(this.item.source, field).subscribe(values => {
        this.options.valueMap[field] = values;
      });
    }
  }
  onCrumClick(index, navs = this.navs) {
    navs.splice(index + 1);
    this.updateRouteQueryParam({ navs });
  }
  private selectAggregationType(item) {
    if ((!item.activeData || item.activeData.groupBy || !item.activeData.aggregate) && item.groupBy) {
      delete item.aggregate;
    } else {
      delete item.groupBy;
    }
    return item;
  }
  reload() {
    this.item.options = this.item.options || {};
    clean(this.item.options);
    this.item.filters = this.filters;
    this.dashItemService.previewChartItem(this.selectAggregationType({ ...this.item })).subscribe(item => {
      this.previewData = item.data;
      this.item._data = item._data || item.data;
    }, error => {
      const parsedError = parseApiError(error, 'error while loading chart data!');
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  updateItem() {
    if (this.createMode)
      this.dashItemService.createItem(this.selectAggregationType({ ...this.item })).subscribe(() => this.close()
        , error => {
          const parsedError = parseApiError(error, 'error while saving item!');
          this.toastr.error(parsedError.message, parsedError.title);
        });
    else {
      this.dashItemService.saveItem(this.selectAggregationType({ ...this.item })).subscribe(() => {
        this.toastr.success(`'${this.item.name || 'Item'}' saved successfully`)
      }, error => {
        const parsedError = parseApiError(error, 'error while saving data!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
    }
  }

  selectDataSource(source) {
    this.item.source = source;
    if (this.item.itemGroup === 'datatable') {
      const type = 'table';
      this.updateRouteQueryParam({ navs: [...this.navs, pages.selectType, pages.updateOptions], source, type });
      this.processTypeUpdate(type);
    } else {
      this.updateRouteQueryParam({ navs: [...this.navs, pages.selectType], source });
    }
    this.loadSourceInfo(source);
  }
  selectType(type) {
    this.updateRouteQueryParam({ navs: [...this.navs, pages.updateOptions], type });
    this.processTypeUpdate(type);
  }



  blur(value) {
    const datasourceName = value;
    this.duplicateDatasource.state = false;
    this.datasoruceService.searchdataSource(datasourceName).subscribe((datasourcesname: Array<DataSoure>) => {
      if (datasourcesname[0]) {
        this.duplicateDatasource.state = true;
        this.duplicateDatasource.value = datasourceName;
      }
    });
  }


  onOptionSelected(value: string) {

    this.dtcollectionname = value;
    this.datasoruceService.getFieldsTypes(value).subscribe((values) => {

      this.ItemsCol = [...values];


      for (let field of this.ItemsCol) {
        if (field.name.charAt(0) === '_') {
          this.ItemsCol.splice(this.ItemsCol.indexOf(field), 1);
        }
      }

      if (this.selected !== '-1') {
        this.isSelected = true;
      }
      else {
        this.isSelected = false;
      }

    });

  }

  OpenadddataSource() {
    this.title = "Add New";
    this.isAdd = true;
    this.isEdit = false;
    this.resetform();
    this.opendtswin = true;
  }

  resetform() {
    this.dtname = '';
    this.dtgroup = '';
    this.dtdesc = '';
    this.dttoolname = '';
    this.dtcollectionname = '';
    this.selected = '-1';
    this.icon = '';
  }


  addNewDataSource() {

    const name = this.dtname;
    const group = this.dtgroup;
    const collectionName = this.dtcollectionname;
    const description = this.dtdesc
    const toolName = this.dttoolname;
    const image = this.icon;
    const imageType = "image"

    let updatedArray = [];
    for (let el of this.ItemsCol) {
      if (el.label.charAt(0) !== '_') {
        updatedArray.push(el);
      }
    }
    this.ItemsCol = updatedArray;

    const fields = this.ItemsCol;

    // Check Duplicate lable name found
    let duplicateCustomField = [];
    for (let i = 0; i < this.ItemsCol.length; i++) {
      if (duplicateCustomField.indexOf(this.ItemsCol[i].label) === -1) {
        duplicateCustomField.push(this.ItemsCol[i].label);
      }
    }

    var keys = Object.keys(this.ItemsCol);
    var len = keys.length;

    if (len === duplicateCustomField.length) {
      this.isCustomlabelDuplicate = false;
    } else {
      this.isCustomlabelDuplicate = true;
    }

    if (!this.isCustomlabelDuplicate) {
      this.datasoruceService.createDataSource({
        name, group, collectionName, description, toolName, image, imageType, fields,
      }).subscribe((datasource) => {
        if (datasource.id) {
          this.toastr.success("Data source created sucessfully");
          this.loadDataSources();
          this.opendtswin = false;
          this.isSelected = false;
        } else {
          this.toastr.error("Error while creating datasource");
        }
      }, error => {
        const parsedError = parseApiError(error, 'Error while creating dataSource!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
    } else {
      this.toastr.warning("label Name have Duplicate Name!");
      return;
    }

  }

  updateDataSource() {

    const id = this.datasourceId;
    const name = this.dtname;
    const group = this.dtgroup;
    const collectionName = this.selected;
    const description = this.dtdesc
    const toolName = this.dttoolname;
    const image = this.icon;
    const imageType = "image"



    // Check if underScore in the first char in the label name , Don't save the lable name in to the DB.

    let updatedArray = [];
    for (let el of this.ItemsCol) {
      if (el.label.charAt(0) !== '_') {
        updatedArray.push(el);
      }
    }
    this.ItemsCol = updatedArray;

    const fields = this.ItemsCol;



    // Check Duplicate lable name found
    let duplicateCustomField = [];
    for (let i = 0; i < this.ItemsCol.length; i++) {
      if (duplicateCustomField.indexOf(this.ItemsCol[i].label) === -1) {
        duplicateCustomField.push(this.ItemsCol[i].label);
      }
    }

    var keys = Object.keys(this.ItemsCol);
    var len = keys.length;

    if (len === duplicateCustomField.length) {
      this.isCustomlabelDuplicate = false;
    } else {
      this.isCustomlabelDuplicate = true;
    }

    if (!this.isCustomlabelDuplicate) {
      this.datasoruceService.updateDataSource({
        id,
        name, group, collectionName, description, toolName, image, imageType, fields,
      }).subscribe((datasource) => {
        if (datasource.id) {
          this.toastr.success("Data source updated sucessfully");
          this.loadDataSources();
          this.opendtswin = false;
          this.isSelected = false;
        } else {
          this.toastr.error("Error while update datasource");
        }
      }, error => {
        const parsedError = parseApiError(error, 'Error while update dataSource!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
    } else {
      this.toastr.warning("label Name have Duplicate Name!");
      return;
    }
  }

  customFieldblur(event: any, item, i) {

    if (event.target.value === "") {
      this.toastr.success("Custome Field [" + item + "] Should not empty");
      const fieldName = "customField" + i
      const ele = this.aForm.nativeElement[fieldName];
      if (ele) {
        ele.focus();
      }
    }

  }

  removeDataSource(item) {
    if (confirm(`Are you sure to delete data source -` + item.name)) {
      this.datasoruceService.deleteDataSource(item.id).subscribe(() => {
        this.toastr.success("Data source Deleted sucessfully");
        this.loadDataSources();
      },
        error => {
          const parsedError = parseApiError(error, 'Error Deleting dataSource!');
          this.toastr.error(parsedError.message, parsedError.title);
        });
    }
  }

  editDataSource(item) {
    this.title = "Edit";
    this.isEdit = true;
    this.isAdd = false;
    this.datasourceId = item.id;
    this.openEditDataSource(item.id);
    this.opendtswin = true;
  }


  openEditDataSource(id: string) {


    let editDatasource;
    this.isSelected = true;
    this.datasoruceService.getDataSource(id).subscribe((values) => {
      editDatasource = values;
      this.dtname = editDatasource.name;
      this.dtgroup = editDatasource.group;
      this.dtdesc = editDatasource.description;
      this.dttoolname = editDatasource.toolName;
      this.selected = editDatasource.collectionName;
      this.icon = editDatasource.image;

      //Process New Field Name
      let collectionName = editDatasource.collectionName;

      this.datasoruceService.getFieldsTypes(collectionName).subscribe((collectionFields) => {
        editDatasource.fields = editDatasource.fields || []
        const existingFieldNames: string[] = editDatasource.fields.map(f => f.name);
        const newCollectionFields = collectionFields.filter(f => !f.name.startsWith('_') && !existingFieldNames.includes(f.name));
        newCollectionFields.forEach(newField => {
          editDatasource.fields.push({ ...newField, label: newField.name });
        });
        this.ItemsCol = editDatasource.fields;
      });

    });

  }

  closeDlg() {
    this.opendtswin = false;
    this.isSelected = false;
  }

  //Upload External Data

  openUploadDlg() {
    this.check = false;
    this.updatecollectionname = '-1';
    this.loadCollectionsName();
    this.openuploadwin = true;

  }

  importJSON(event) {

    if (this.check) {
      if (this.updatecollectionname == '-1') {
        this.toastr.error("Please Select Collection Name");
        return;
      }
    }
    const file = event.target.files[0];
    let collectionname = file.name;
    collectionname = collectionname.split(".", -1);
    collectionname = "source_JSON_" + collectionname[0];

    if (file.name.endsWith('json')) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (fevent: any) => {
        try {
          const data: string = fevent.target.result;
          const tests = JSON.parse(data);

          if (!this.check) {
            this.addExternalData(tests, collectionname);
          }
          else {
            this.updateExternalData(tests, this.updatecollectionname);
          }

        }
        catch (e) {
          this.toastr.error('error reading file');

        }
      };
    }
    else {
      this.toastr.error('invalid file imported');
    }

  }


  importCSV(event) {

    if (this.check) {
      if (this.updatecollectionname == '-1') {
        this.toastr.error("Please Select Collection Name");
        return;
      }
    }

    const file = event.target.files[0];
    let collectionname = file.name;

    if (file.name.endsWith('csv')) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async (fevent: any) => {
        try {
          const data: string = fevent.target.result;
          collectionname = collectionname.split(".", -1);
          collectionname = "source_CSV_" + collectionname[0];
          let jsondata = await csv().fromString(data).subscribe(function () { });
          if (!this.check) {
            this.addExternalData(JSON.stringify(jsondata), collectionname);
          }
          else {
            this.updateExternalData(JSON.stringify(jsondata), this.updatecollectionname);
          }

        }
        catch (e) {
          this.toastr.error('error reading file');

        }
      };
    }
    else {
      this.toastr.error('invalid file imported');
    }

  }


  resetFileInput(event) {
    event.target.value = '';
  }

  onCheckboxChange() {
    this.updatecollectionname = '-1';
  }

  oncollnameSelected(value) {
    this.updatecollectionname = value;
  }

  addExternalData(data: any, CollectionName: string) {

    this.datasoruceService.addExternalData(data, CollectionName).subscribe(() => {
      this.toastr.success("Data imported successfuly");
      this.loadDataSources();
      this.openuploadwin = false;
    },
      error => {
        const parsedError = parseApiError(error, 'Error in Data import ');
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }

  updateExternalData(data: any, CollectionName: string) {

    this.datasoruceService.UpdateExternalData(data, CollectionName).subscribe(() => {
      this.toastr.success("Data updated successfuly");
      this.loadDataSources();
      this.openuploadwin = false;
    },
      error => {
        const parsedError = parseApiError(error, 'Error in Data import ');
        this.toastr.error(parsedError.message, parsedError.title);
      });

  }

  //End of External Data

}
