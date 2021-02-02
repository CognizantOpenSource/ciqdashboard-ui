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
import { FormGroup, Validators, FormBuilder, FormArray, FormControl, Form, FormsModule } from '@angular/forms';

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

  // Create View Variables
  
  opencreateviewswin =  false
  public createViewform: FormGroup;
  public baseCollection: FormGroup;

  selectedbaseCol: any = [];
  ItemsBaseCol: any=[];

  lookupsColwin =  false;

  isBaseSelected: boolean = false;
  

  lookupsselected: any;

  
  ItemslookupCol: any = [];
  selectedlookupsCol: any = [];
  lookupidx: number;

  islookupsSelected: boolean = false;
  selectedlookupsfield: any=[];
  selectedbasefield: any=[];

  idx=0;

  updatedlookupcollectionnames:  any;

  // End of Create View Variables

  createMode = true;
  navs = [];

  constructor(

    private fb: FormBuilder,

    route: ActivatedRoute, router: Router, spec: FilterOps, toastr: ToastrService,
    private dashItemService: DashboardItemsService, private datasoruceService: DashboardDataSourceService
  ) {
    super(route, router, spec, toastr);

    this.createViewform = fb.group({
      name: ['New View',Validators.required],
      baseCollection : this.baseCollection = this.fb.group({
        name: new FormControl(),
        fields: new FormArray([])
      }),
      'lookups': fb.array([])
  });

  }

  get funcviewform() { return this.createViewform.controls }
  get funcbaseCollection() { return this.baseCollection.controls}
  get funcfields() { return this.funcbaseCollection.fields as FormArray; }


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
      this.updatedlookupcollectionnames = values;
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

    this.isSelected=false;
    if (this.ItemsCol.length >  0)  {
      this.ItemsCol.splice(0,this.ItemsCol.length)
    }

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

  //********************************************************************************** */
//Start Create View 
//********************************************************************************** */

 //************************************************** */
 // Opencreateview - 
 // Description : To Open CreteView Dialog and clear the 
 // previous data and rest the fields. and delete
 // the controls
//************************************************** */

Opencreateview(){

  this.lookupidx = 0;
  this.opencreateviewswin =  true;
  this.createViewform.reset();
  this.baseCollection.reset();
  this.createViewform.setControl('lookups', this.fb.array([]));

  this.baseCollection.setControl('fields',this.fb.array([]));

  if(this.collectionNames.length > 0) {
    this.collectionNames.splice(0,this.collectionNames.length)
    this.loadCollectionsName();
  }

  if (this.ItemslookupCol.length >  0)  {
    this.ItemslookupCol.splice(0,this.ItemslookupCol.length)
  }
  
  if (this.ItemsBaseCol.length >  0)  {
     this.ItemsBaseCol.splice(0,this.ItemsBaseCol.length)
  }

 this.selectedbaseCol="";
 this.isBaseSelected=false;
  
 this.createViewform.controls.name.setValue("New View");
}

//************************************************** */
// onBaseCollectionSelected
// Description : To get field name from the selected collection name
// and populate the UI
//************************************************** */
onBaseCollectionSelected(collectionName: string) {

 this.baseCollection.reset();
 this.baseCollection.setControl('fields',this.fb.array([]))

this.selectedbaseCol = collectionName;

this.datasoruceService.getFieldsTypes(collectionName).subscribe((values) => {

this.ItemsBaseCol = [...values];
this.isBaseSelected=true;

this.updatecollectionName(collectionName,this.selectedbaseCol);

this.ItemsBaseCol= this.ItemsBaseCol.filter(function(field) {
return field.name.charAt(0) !== '_';
});



});
this.addBaseUI(collectionName);


}

//**************************************************************** */
// addBaseUI
// Description : To populate the Basecollection UI with fields and alias
//**************************************************************** */

addBaseUI(collName: string,data?: any) {

this.createViewform.get('baseCollection').get('name').setValue(collName);
let baseIndex = (<FormArray>this.createViewform.get('baseCollection').get('fields')).length-1;
this.addBase(baseIndex);


}

//**************************************************************** */
// addBase
// Description : To Populate the name and alise format inside the fields array
//
// Ex. fields [
//        "name" : "",
//          "alias" : "" 
//          ]
//**************************************************************** */

addBase(baseIndex: number, data?: any) {
let fg =  this.fb.group({
'name': [data ? data : '', Validators.compose([Validators.required])],
'alias': new FormControl()
});
(<FormArray>this.createViewform.get('baseCollection').get('fields')).push(fg)


}

//**************************************************************** */
// OpenlookupCollectionDlg
// Description : Click the Addlookups button, to call the function to open the
// lookup collection dialog for selecting the collection
//**************************************************************** */

OpenlookupCollectionDlg() {
this.lookupsColwin=true;
}


//**************************************************************** */
// onlookupsCollectionSelected
// Description : Click on Addlookups to Open a Dialog for select the lookup
// Collection. After select the collection , Need to popuplate the lookups UI
//**************************************************************** */

onlookupsCollectionSelected(collectionSelected: string) {

let getCollectionField;
this.datasoruceService.getFieldsTypes(collectionSelected).subscribe((collectionFields) => {​​​​​​​​

this.selectedlookupsCol.push(collectionSelected);
getCollectionField = collectionFields;
let finalfield= getCollectionField.filter(ele=> !ele.name.startsWith('_'));
this.ItemslookupCol.push(finalfield);
this.islookupsSelected = true;

this.updatecollectionName(collectionSelected,this.selectedlookupsCol);


});
 


this.addlookupUI(collectionSelected);
}

updatecollectionName(cSelected: string,collectionName:any) {
    this.updatedlookupcollectionnames = this.collectionNames.filter(cSelected => !collectionName.includes(cSelected));
}

//**************************************************************** */
// addlookupUI
// Description : To load the lookup UI , popuplate the controls after select the
// lookup collection.
//**************************************************************** */

addlookupUI(collName: string,data?: any) {
let fg = this.fb.group({
'name': [data ? data.name : collName, Validators.compose([Validators.required])],
'fields': this.fb.array([]),
'localForeignFields': this.fb.array([]),
 alias: new FormControl()

});
(<FormArray>this.createViewform.get('lookups')).push(fg);


let lookupIndex = (<FormArray>this.createViewform.get('lookups')).length - 1;
this.createViewform.get(['lookups',lookupIndex]).get('alias').setValue(collName);


if (!data) {
this.addlookup(lookupIndex);
this.addlocalForeignFields(lookupIndex);
}
else {
data.field.forEach(field => {
    this.addlookup(lookupIndex, field);
});
}

this.lookupsColwin = false;

}

//**************************************************************** */
// addlookup
// Description : To load the lookup UI fields Json format
// Ex. fields [
//        "name" : "",
//          "alias" : "" 
//          ]
//**************************************************************** */

addlookup(Idx: number, data?: any) {

let fg = this.fb.group({
'name': [data ? data : '', Validators.compose([Validators.required])],
'alias': new FormControl()
});

(<FormArray>(<FormGroup>(<FormArray>this.createViewform.controls['lookups'])
.controls[Idx]).controls['fields']).push(fg);

}

//**************************************************************** */
// addlocalForeignFields
// Description : To load LocalForeignFields controls user can selct the 
// source Field and lookup Field and to create a Json format
// For Ex.
// localForeignFields": [  
//  {
//    "localField": "domainName",
//    "foreignField": "domainName"
// }
//**************************************************************** */

addlocalForeignFields(localForeignFieldIndex: number,data?: any) {
let fg = this.fb.group({
'localField': [data ? data : '', Validators.compose([Validators.required])],
'foreignField': [data ? data : '', Validators.compose([Validators.required])],
});
(<FormArray>(<FormGroup>(<FormArray>this.createViewform.controls['lookups'])
  .controls[localForeignFieldIndex]).controls['localForeignFields']).push(fg);

  
}


//**************************************************************** */
// On click Create View
// Description : Create a View, to map the various fields from 
// various collection. 
//**************************************************************** */

createview(formValue) {

this.datasoruceService.createView(formValue).subscribe((values) => {

this.toastr.success("View Created successfuly");
this.createViewform.reset();
this.opencreateviewswin = false;
},
error => {
const parsedError = parseApiError(error, 'Error in Create View ');
this.toastr.error(parsedError.message, parsedError.title);
});


}

//**************************************************************** */
//onChangeBaseField
// Description : The user select the base field from the 
// drop down, automatically populate the same value in the alise
//**************************************************************** */

onChangeBaseField(fieldName: any,index: number) {
//let baseFieldIndex = (<FormArray>this.createViewform.get('baseCollection').get('fields')).length-1;
this.createViewform.get('baseCollection').get(['fields', index]).setValue({name: fieldName,alias: fieldName});
}

//**************************************************************** */
// onChangeLookupField
// Description : The user select the base field from the 
// drop down, automatically populate the same value in the alise
//**************************************************************** */
onChangeLookupField(fieldName: any,index: number) {

let lookupIndex = (<FormArray>this.createViewform.get('lookups')).length - 1;
let lookupFieldIndex = (<FormArray>this.createViewform.get(['lookups',lookupIndex]).get('fields')).length-1;
this.createViewform.get(['lookups',lookupIndex]).get(['fields', index]).setValue({name: fieldName,alias: fieldName});
}

//**************************************************************** */
// onChangelookupCollectionAlias
// Description : The user select the lookup collection from the 
// drop down from the Dialog box, automatically populate the same collection 
// name in the Collection alias
//**************************************************************** */
onChangelookupCollectionAlias(collectionName: any) {
let lookupIndex = (<FormArray>this.createViewform.get('lookups')).length - 1;
this.createViewform.get(['lookups',lookupIndex]).get('alias').setValue(collectionName);

}

//**************************************************************** */
// deleteBaseField
// Description : To delete control from baseField
//**************************************************************** */

deleteBaseField(baseFieldIdx: number) {
(<FormGroup>(<FormArray>this.createViewform.controls.baseCollection)
.controls['fields'].removeAt(baseFieldIdx));
}

//**************************************************************** */
// deletelookupField
//  Description : To delete control from lookupfield
//**************************************************************** */
deletelookupField(lookupIdx: number, lookupFieldIdx: number) {
(<FormArray>(<FormGroup>(<FormArray>this.createViewform.controls['lookups'])
.controls[lookupIdx]).controls['fields']).removeAt(lookupFieldIdx);
}

//**************************************************************** */
// deletelocalForeignFields
// Description : To delete control from localForeignFields
//**************************************************************** */
deletelocalForeignFields(lookupIdx: number, lookuplocalForeignFieldIdx: number) {
(<FormArray>(<FormGroup>(<FormArray>this.createViewform.controls['lookups'])
.controls[lookupIdx]).controls['localForeignFields']).removeAt(lookuplocalForeignFieldIdx);
}

//**************************************************************** */
// deleteLookup
// Description : To delete control from Add lookup controls
//**************************************************************** */
deleteLookup(lookupIdx: number) {
this.updatedlookupcollectionnames.push(this.selectedlookupsCol[lookupIdx])
this.selectedlookupsCol.splice(lookupIdx, 1);
(<FormArray>this.createViewform.get('lookups')).removeAt(lookupIdx);
}

//**************************************************************** */
// closeCreateViewDlg
// Description : To Close the Create View Dialog
//**************************************************************** */
closeCreateViewDlg() {
this.opencreateviewswin=false;
this.createViewform.reset();

}

//********************************************************************************** */
//End of Create View
//********************************************************************************** */

//*********************************************************************************** */
// For Build issue fix
// Property Fix
//*********************************************************************************** */

get formData() { return <FormArray>this.createViewform.get('lookups'); }

//*********************************************************************************** */



}
