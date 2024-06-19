
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnSubscribable, EntityFilter } from 'src/app/components/unsub';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { MetricsService } from 'src/app/services/auth/admin/metrics.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-metric-editor',
  templateUrl: './metric-editor.component.html',
  styleUrls: ['./metric-editor.component.scss']
})
export class MetricEditorComponent extends UnSubscribable implements OnInit {
  isAddMetric: boolean = false;
  isdataSourceReadOnly:boolean = false;
  metric: any = {
    "id": "",
    "metricName": "",
    "category": "",
    "calculationType": "",
    "toolType": "",
    "grouping": "No",
    "groupBy": "",
    "groupValue": "All",
    "trending": "No",
    "trendBy": "",
    "trendingField": "",
    "trendCount": "",
    "dataSource": "",
    "formula": "",
    "formulaParams": "{}",
    "customFunction":"No",
    "customFunctionName":""
  };
  metricsForm: FormGroup = this.createNewForm();
  obj:any = {};
  formulainput = false;
  editformula = false;
  parameterdiv = false;
  isFormulaReadOnly = false;
  IssueTypeArr = []
  IssueTypeArrOrg = []
  IssueTypeArrGroupBy =[]
  IssueTypeArrTrendBy =[]
  formArrcount = 0;
  formcounter = 0;
  formArrDataListRemove:any = []
  selecteddataSource;
  myJsonString = "";
  selectedFormula: any = []
  dataSource = [];
  dataSourceVal;
  variablesList: any[] = [];
  metricCategoryObjects: any;
  metricCustomNameObjects:any;
  metricCalculationTypeObjects:any;
  metricTrendFieldObjects:any;
  metricFunctionObjects:any;
  dataSourceArrData: any = {};
  numberFieldLabel;
  metricsConfigData = [];
  constructor(
    private router: Router, private route: ActivatedRoute, private location: Location,
    private metricsService: MetricsService,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef, private fb: FormBuilder) {
    super();
    this.isAddMetric = router.url.includes('_/edit');
  }

  ngOnInit() {
    this.metricsService.getDataSources().subscribe(datasources => {
      this.dataSource = datasources;
      this.cdRef.detectChanges();
      this.cdRef.markForCheck();
      this.managed(this.route.params).subscribe(params => {
        if (!this.isAddMetric) {// Update
          this.metricsService.getMetricsConfigByID(params.metricId).subscribe(metricConfig => {
            this.metric = metricConfig;
            let datasourceVal = this.metric.dataSource;
            let formulaparamsArr = this.metric.formulaParams;
            let formulastring = this.metric.formula;
            Object.keys(formulaparamsArr).forEach(keys => {
              if(this.metric.formula.includes(keys)){
                var stringform = '$'+keys+'$';
                formulastring = formulastring.replace(keys,stringform);
              }
            });
            this.metric.formula = formulastring;
            this.metricsForm.get('dataSource').setValue(datasourceVal);
            this.metricsForm.get('formula').setValue(this.metric.formula);
            this.metricsForm.get('formulaParams').setValue(JSON.stringify(this.metric.formulaParams));
            this.cdRef.detectChanges();
            this.cdRef.markForCheck();
            this.ondataSourceSelected('','','');
            this.selectedFormData('');
          });
        }
      });
    });
    this.metricsService.getMetricsConfig().subscribe(metricsConfig => {
      this.metricsConfigData = metricsConfig;
    });
    this.metricsService.getMetricCategory().subscribe(metricCategory => {
        this.metricCategoryObjects = metricCategory;
    });
    this.metricsService.getMetricCustomName().subscribe(metricCustomName => {
      this.metricCustomNameObjects = metricCustomName;
    });
    this.metricsService.getMetricCalculationType().subscribe(metricCalculationType => {
      this.metricCalculationTypeObjects = metricCalculationType;
    });
    this.metricsService.getMetricTrendField().subscribe(metricTrendField => {
      this.metricTrendFieldObjects = metricTrendField;
    });
    this.metricsService.getMetricFunction().subscribe(metricFunction => {
      this.metricFunctionObjects = metricFunction;
    });
  }
  addMetric($event: MouseEvent) {
    try {
      this.focusNewFunction();
      let metricNameVal;
      //console.log('thismetric',this.metric,this.metricsForm.value);
      if (this.isJsonString(this.metric.formulaParams) || this.metricsForm.controls['customFunction'].value==='No') {
        //console.log('afterUpdate',this.metric);
        this.metric.metricName = this.metricsForm.controls['metricName'].value;
        this.metric.category = this.metricsForm.controls['category'].value;
        this.metric.customFunction = this.metricsForm.controls['customFunction'].value;
        this.metric.customFunctionName = this.metricsForm.controls['customFunctionName'].value;
        this.metric.customParams = this.metricsForm.controls['customParams'].value;
        this.metric.calculationType = this.metricsForm.controls['calculationType'].value;
        this.metric.toolType = this.metricsForm.controls['toolType'].value;
        this.metric.grouping = this.metricsForm.controls['grouping'].value;
        this.metric.groupBy = this.metricsForm.controls['groupBy'].value;
        this.metric.groupValue = this.metricsForm.controls['groupValue'].value;
        this.metric.trending = this.metricsForm.controls['trending'].value;
        this.metric.trendBy = this.metricsForm.controls['trendBy'].value;
        this.metric.trendingField = this.metricsForm.controls['trendingField'].value;
        this.metric.trendCount = this.metricsForm.controls['trendCount'].value;
        let selectedFormula = this.metricsForm.controls['formula'].value;
        var res = selectedFormula.replace(/[$]/g, '');
        this.metricsForm.get('formula').setValue(res);
        this.metric.dataSource = this.metricsForm.controls['dataSource'].value;
        this.metric.formula = res;
        delete this.metric['id'];
        this.metric.formulaParams = JSON.parse(this.metric.formulaParams);
        //console.log('AfterInsertmetric',this.metric);
        metricNameVal = this.metricsForm.controls['metricName'].value;
        var isPresent = this.metricsConfigData.some(function(el){ return el.metricName === metricNameVal});
        //console.log('isPresent',isPresent);
        if(this.metric.metricName=== "" || this.metric.category==="" ){
          this.toastr.error('Please make sure all the field entered or selected'); 
        }
        else if(isPresent){
          this.toastr.error('The metric name are already exists');
        }
        else if(this.metric.customFunction==='No' && (this.metric.calculationType ==="" || this.metric.toolType==="" || this.metric.formula==="" || this.metric.formulaParams==="")){
          this.toastr.error('Please make sure all the field entered or selected'); 
        }
        else if(this.metric.customFunction==='Yes' && (this.metric.customFunctionName==="" || this.metric.customparams === "")){
          this.toastr.error('Please make sure all the field entered or selected related to CustomFunction');
        }
        else if(this.metric.grouping==='Yes' && (this.metric.groupBy==="" || this.metric.groupValue === "")){
          this.toastr.error('Please make sure all the field entered or selected related to grouping');
        }
        else if(this.metric.trending==='Yes' && (this.metric.trendBy==="" || this.metric.trendingField === "" || this.metric.trendCount === "" || this.metric.trendCount === null)){
          this.toastr.error('Please make sure all the field entered or selected related to trending');
        }
        else {
          for (var key in this.metric) {
            if (this.metric[key] === "")
                this.metric[key] = null;
          }
          //console.log('metriccc',this.metric);
          this.metricsService.saveMetricConfig(this.metric).subscribe(metricsConfig => {
            this.toastr.success('metric created successfully');
            this.router.navigate(['/admin/metrics']);
          });
        }
      }
      else {
        this.toastr.warning('Parameters Definition is not a valid JSON format !!');
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  updateMetric($event: MouseEvent) {
    try {
      this.focusNewFunction();
      if (this.isJsonString(this.metric.formulaParams)) {
        let selectedFormula = this.metricsForm.controls['formula'].value;
        var res = selectedFormula.replace(/[$]/g, '');
        this.metricsForm.get('formula').setValue(res);
        this.metric.dataSource = this.metricsForm.controls['dataSource'].value;
        this.metric.formula = res;
        this.metric.formulaParams = JSON.parse(this.metric.formulaParams);
        this.metricsService.updateMetricConfig(this.metric).subscribe(metricsConfig => {
          this.toastr.success('metric updated successfully');
          this.router.navigate(['/admin/metrics']);
        });
      } else {
        this.toastr.warning('Parameters Definition is not a valid JSON format !!');
      }

    } catch (ex) {
      console.log(ex);
    }
  }
  close($event: MouseEvent) {
    this.location.back();
  }
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  onChangeRadiobutton(event,radioval){
    let selectedRadiobutton;
    //console.log('event',event);
    if(event!="" && event != undefined){
      selectedRadiobutton = event.target.value;
      //console.log('selectRadioButton',selectedRadiobutton,radioval);
      if((selectedRadiobutton==='Yes'&& radioval=='trending')){
        if(this.metricsForm.controls['grouping'].value == 'Yes'){
          this.metricsForm.patchValue({
            grouping: 'No',
          });
        }
      }
      if((selectedRadiobutton==='Yes'&& radioval=='grouping')){
        if(this.metricsForm.controls['trending'].value == 'Yes'){
          this.metricsForm.patchValue({
            trending: 'No',
          });
        }
      }
      if((selectedRadiobutton==='Yes'&& radioval=='customfunction')){
        this.metricsForm.patchValue({
          grouping: 'No',
        });
        this.metricsForm.patchValue({
          trending: 'No',
        });
      }
    }
  }
  createNewForm(): FormGroup {
    return this.fb.group({
      metricName : [''],
      category : [''],
      customFunction : ['No'],
      customFunctionName : [''],
      customParams : [''],
      calculationType : [''],
      toolType : [''],
      grouping : ['No'],
      groupBy : [''],
      groupValue : ['All'],
      trending : ['No'],
      trendBy : [''],
      trendingField : [''],
      trendCount : [''],
      dataSource : [''],
      formula: [''],
      formulaParams: ['']
    });
  }
  ontoolTypeSelected(event: any,i:any,toolType:any,formArrcount:any){
      //console.log('onToolTypeSelected',toolType);
      toolType = this.metricsForm.controls['toolType'].value;
      this.IssueTypeArrGroupBy = [];
      this.dataSource.forEach(datasrcelement => {
        if (datasrcelement.name == toolType) {
          datasrcelement.fields.forEach(fieldselement => {
            this.IssueTypeArrGroupBy.push(fieldselement.label);
          });
        }
      });
      this.dataSource.forEach(datasrcelement => {
        if (datasrcelement.name == toolType) {
          //console.log(datasrcelement);
          datasrcelement.fields.forEach(fieldselement => {
            if(fieldselement.type == 'date'){
              this.IssueTypeArrTrendBy.push(fieldselement.label);
            }
          });
        }
      });
  }
  selectedFormData(event: any): void {
    //console.log('eventdata', event,this.metricsForm.get('formulaParams').value,this.isAddMetric);
    this.editformula = true;
    this.isFormulaReadOnly = true;
    this.variablesList = []
    let editformulaparams;
    const specialChars = /[$]/g;
    this.selectedFormula = this.metricsForm.controls['formula'].value;
    if (this.isAddMetric) {
      editformulaparams = false;
      if (this.selectedFormula == undefined || this.selectedFormula == "") {
        this.parameterdiv = false;
        this.isFormulaReadOnly = false;
        this.editformula = false;
        this.toastr.error('Please enter the formula');
        return;
      }
      else if (!specialChars.test(this.selectedFormula)) {
        this.parameterdiv = false;
        this.editformula = false;
        this.isFormulaReadOnly = false;
        this.toastr.error('To define variable maintain prefix & postfix as $ (e.g) $variable$');
        return;
      }
      else{
        this.separatestring(editformulaparams);
      }
    }
    else {
      editformulaparams = true;
      this.separatestring(editformulaparams);
      this.parameterdiv = true;
    }
  }
  separatestring(editformulaparams){
    let formArrDataList:any = [];
    this.parameterdiv = true;
    let posArr = [];
    this.selectedFormula = this.metricsForm.controls['formula'].value;
    for (let i = 0; i <= this.selectedFormula.length; i++) {
      if (2 != posArr.length) {
        if ('$' == this.selectedFormula.charAt(i)) {
          posArr.push(i);
        }
      }
      if (posArr.length == 2)   {
        this.obj = {
          label: this.selectedFormula.substring((posArr[0] + 1), posArr[1]),
          modelName: this.selectedFormula.substring((posArr[0] + 1), posArr[1]) + 'Model',
          datasource: this.selectedFormula.substring((posArr[0] + 1), posArr[1]) + 'datasource',
          modelArrName: this.selectedFormula.substring((posArr[0] + 1), posArr[1]) + 'ModelArr',
          sumField: this.selectedFormula.substring((posArr[0] + 1), posArr[1]) + 'sumField',
          sumISODiff: this.selectedFormula.substring((posArr[0] + 1), posArr[1]) + 'sumISODiff'
        };
        this.dataSourceArrData[this.selectedFormula.substring((posArr[0] + 1), posArr[1]) + 'DropdownVal'] = [];
        this.variablesList.push(this.obj);
        //console.log('variableList',this.variablesList);
        if (!this.isAddMetric) {
          //console.log('obj',obj,this.variablesList);
          let keyValueData = Object.keys(this.metric.formulaParams[this.obj.label]);
          this.metricsForm.addControl(this.obj.modelName, new FormControl(keyValueData, []));
          this.metricsForm.addControl(this.obj.datasource, new FormControl(keyValueData, []));
          this.metricsForm.addControl(this.obj.modelArrName, this.fb.array([]));
          this.metricsForm.addControl(this.obj.sumField, new FormControl(keyValueData, []));
          this.metricsForm.addControl(this.obj.sumISODiff, new FormControl(keyValueData, []));
          // this.metricsForm.addControl(this.obj.dsDropdownVal, this.fb.array([]));
          formArrDataList = this.metricsForm.controls[this.obj.modelArrName] as FormArray;
          //console.log(formArrDataList);
          Object.keys(this.metric.formulaParams[this.obj.label][keyValueData[0]]).forEach((element: any, index: number) => {
            formArrDataList.push(this.createDataArrayModelsEdit(this.obj.label, index, element, this.metric.formulaParams[this.obj.label][keyValueData[0]][element]));
          })
        } else {
          this.metricsForm.addControl(this.obj.modelName, new FormControl(0, []));
          this.metricsForm.addControl(this.obj.datasource, new FormControl(0, []));
          this.metricsForm.addControl(this.obj.modelArrName, this.fb.array([]));
          this.metricsForm.addControl(this.obj.sumField, new FormControl(0, []));
          this.metricsForm.addControl(this.obj.sumISODiff, new FormControl(0, []));
          // this.metricsForm.addControl(this.obj.dsDropdownVal, this.fb.array([]));
          //console.log('thismetricsForm',this.metricsForm);
        }
        posArr = [];
      }
    }
  }
  ondataSourceSelected(event: any, modelName: string, label: string) {
    //console.log('ondataSourceSelect',this.metricsForm.controls[modelName].value)
    let IssueTypeArrOrg: any = [];
    let IssueTypeArrSumField:any = [];
    let IssueTypeArrSumISODiff:any = []
    if(event!="" && event != undefined){
      if(typeof(event) === 'object'){
        this.selecteddataSource = event.target.value;
      }
      else{
        this.selecteddataSource = event;  
      }
      //console.log('dataSource',this.dataSource);
      if(this.metricsForm.controls[modelName].value == 'countAnd' || this.metricsForm.controls[modelName].value == 'sumISODiffAnd') {
        this.dataSource.forEach(datasrcelement => {
          if (datasrcelement.name == this.selecteddataSource) {
            datasrcelement.fields.forEach(fieldselement => {
              IssueTypeArrOrg.push(fieldselement.label);
            });
          }
        });
        this.dataSourceArrData[label+'DropdownVal'] = IssueTypeArrOrg;
      }
      if (this.metricsForm.controls[modelName].value == 'sum' || this.metricsForm.controls[modelName].value == 'sumAnd'
        || this.metricsForm.controls[modelName].value == 'avg' || this.metricsForm.controls[modelName].value == 'avgAnd'
        || this.metricsForm.controls[modelName].value == 'max' || this.metricsForm.controls[modelName].value == 'maxAnd'
        || this.metricsForm.controls[modelName].value == 'min' || this.metricsForm.controls[modelName].value == 'minAnd'
        || this.metricsForm.controls[modelName].value == 'sumISO' || this.metricsForm.controls[modelName].value == 'sumISOAnd') {
        this.dataSourceArrData[label + 'DropdownVal'] = []
        this.dataSourceArrData[label + 'sumField'] = []
        this.dataSource.forEach(datasrcelement => {
          if (datasrcelement.name == this.selecteddataSource) {
            datasrcelement.fields.forEach(fieldselement => {
              IssueTypeArrOrg.push(fieldselement.label);
            });
          }
        });
        this.dataSourceArrData[label + 'DropdownVal'] = IssueTypeArrOrg;
        this.dataSource.forEach(datasrcelement => {
          if (datasrcelement.name == this.selecteddataSource) {
            datasrcelement.fields.forEach(fieldselement => {
              if (fieldselement.type == 'int' || fieldselement.type == 'long' || fieldselement.type == 'double') {
                IssueTypeArrSumField.push(fieldselement.label);
              }
            });
          }
        });
        this.dataSourceArrData[label + 'sumField'] = IssueTypeArrSumField;
      }
      if (this.metricsForm.controls[modelName].value == 'sumISODiff' || this.metricsForm.controls[modelName].value == 'sumISODiffAnd'){
        this.dataSourceArrData[label + 'sumISODiff'] = []
        this.dataSourceArrData[label + 'sumISODiffField'] = []
        this.dataSource.forEach(datasrcelement => {
          if (datasrcelement.name == this.selecteddataSource) {
            datasrcelement.fields.forEach(fieldselement => {
              if (fieldselement.type == 'date') {
                IssueTypeArrSumISODiff.push(fieldselement.label);
              }
            });
          }
        });
        this.dataSourceArrData[label + 'sumISODiff'] = IssueTypeArrSumISODiff;
        this.dataSourceArrData[label + 'sumISODiffField'] = IssueTypeArrSumISODiff;
      }
    }
  }

  private createDataArrayModelsEdit(modelName: string, controlPushData: number, dropValue: any, textValue: any): FormGroup {
    return new FormGroup({
      [modelName + controlPushData + 'drop']: new FormControl(dropValue),
      [modelName + controlPushData + 'text']: new FormControl(textValue)
    })
  }

  private createDataArrayModels(modelName: string): FormGroup {
    return new FormGroup({
      [modelName + 'drop']: new FormControl(''),
      [modelName + 'text']: new FormControl('')
    })
  }
  private createdsDropdown(modelName: string,dataSource:string,controlPushData: number): FormGroup {
    return new FormGroup({
      [modelName + dataSource + controlPushData]: new FormControl('')
    })
  }
  createModelName(modelName: string,type: string): string {
    //console.log('modelname',modelName,type);
    return modelName + type;
  }
  getControlCount(modelName: string): string {
    return this.metricsForm.controls[modelName].value;
  }
  addFormArraydata(modelName: string, formArrayName: string, selectedSource: string, index: number, label: string){
    //console.log(modelName,formArrayName,selectedSource,index,label,this.metricsForm);
    this.createFormArraydata(modelName,formArrayName,selectedSource, index, label);
  }
  createFormArraydata(modelName: string, formArrayName:string, selecteddataSource:string, index: number, label: string): void {
    let formArrDataList;
    //console.log('formArrDataList',formArrDataList,selecteddataSource,this.metricsForm);
    formArrDataList = this.metricsForm.controls[formArrayName] as FormArray;
    //console.log(formArrayName);
    //console.log(formArrDataList);
    if(selecteddataSource === 'firstfunctionselect'){
      formArrDataList.clear();
    }
    switch (this.metricsForm.controls[modelName].value) {
      case 'countAnd':
      case 'sumAnd':
      case 'avgAnd':
      case 'maxAnd':
      case 'minAnd':
      case 'sumISOAnd':
      case 'sumISODiffAnd':
        formArrDataList.push(this.createDataArrayModels(modelName));
        //this.ondataSourceSelected(selecteddataSource, modelName, label);
        break;
      default:
        formArrDataList.reset();
        break;
    }
  }
  removeFormArraydata(modelArrName:string,index:number): void {
    let formArrDataListRemove = this.metricsForm.controls[modelArrName] as FormArray;
    //console.log(formArrDataListRemove);
    formArrDataListRemove.removeAt(index);
  }
  focusNewFunction(): void {
    //console.log('formulaparams',this.metricsForm.controls['formulaParams'].value,this.myJsonString);
    let selectedFormula: any = []
    //console.log(this.metricsForm.value);
    let formValue = this.metricsForm.value;
    let formulaParamsobj = {};
    let modelName;
    let datasource;
    this.variablesList.forEach((data: any) => {
      formulaParamsobj[data.label] = {};
      //console.log('data',data);
      modelName = this.metricsForm.controls[data.modelName].value;
      datasource = this.metricsForm.controls[data.datasource].value;
      //console.log('modelaname',this.metricsForm.controls[data.modelName].value,formValue[data.modelArrName]);
      formulaParamsobj[data.label][modelName] = {}
      formulaParamsobj[data.label][modelName]['collection'] = this.metricsForm.controls[data.datasource].value;
      if(this.metricsForm.controls[data.modelName].value == 'sum' || this.metricsForm.controls[data.modelName].value == 'sumAnd'){
        formulaParamsobj[data.label][modelName]['sum_field'] = this.metricsForm.controls[data.sumField].value;
      }
      if(this.metricsForm.controls[data.modelName].value == 'avg' || this.metricsForm.controls[data.modelName].value == 'avgAnd'){
        formulaParamsobj[data.label][modelName]['avg_field'] = this.metricsForm.controls[data.sumField].value;
      }
      if(this.metricsForm.controls[data.modelName].value == 'max' || this.metricsForm.controls[data.modelName].value == 'maxAnd'){
        formulaParamsobj[data.label][modelName]['max_field'] = this.metricsForm.controls[data.sumField].value;
      }
      if(this.metricsForm.controls[data.modelName].value == 'min' || this.metricsForm.controls[data.modelName].value == 'minAnd'){
        formulaParamsobj[data.label][modelName]['min_field'] = this.metricsForm.controls[data.sumField].value;
      }
      if(this.metricsForm.controls[data.modelName].value == 'sumISO' || this.metricsForm.controls[data.modelName].value == 'sumISOAnd'){
        formulaParamsobj[data.label][modelName]['sum_field'] = this.metricsForm.controls[data.sumField].value;
      }
      if(this.metricsForm.controls[data.modelName].value == 'sumISODiff' || this.metricsForm.controls[data.modelName].value == 'sumISODiffAnd'){
        formulaParamsobj[data.label][modelName]['field1'] = this.metricsForm.controls[data.sumField].value;
        formulaParamsobj[data.label][modelName]['field2'] = this.metricsForm.controls[data.sumISODiff].value;
      }
      formValue[data.modelArrName].forEach(element => {
        Object.keys(element).forEach((keyValue: any, keyIndex: number) => {
          //console.log('keyValue',keyValue,keyIndex);
          if(Object.values(element)[0]!=""){
            formulaParamsobj[data.label][modelName][Object.values(element)[0]] = Object.values(element)[1];
          } 
        })
      });
    });
    // Object.values(formulaParamsobj).forEach((keyValue1: any, keyIndex1: number) => {
    //     console.log('keyValue',keyIndex1,keyValue1)
    //     if(keyValue1[keyIndex1]!=""){
    //       Object.values[keyValue1]
    //     }
    // });
    this.myJsonString = JSON.stringify(formulaParamsobj);
    //console.log('forumlaParamswithStringfy',formulaParamsobj);
    this.metricsForm.get('formulaParams').setValue(this.myJsonString);

    selectedFormula = this.metricsForm.controls['formula'].value;

    //console.log('FinalFormVal', this.metricsForm.value);
    this.metric.formulaParams = this.myJsonString;
    //console.log('ngModelFinalVal', this.metric);
    // if(this.metricsForm.controls['formulaParams'].value==""){
    // }
    // else{
    //   this.toastr.error('Please clear the Parameter Definition and click again');
    // }
  }
  FormulaEdit(event: MouseEvent | false = false) {
    //console.log('formulaedit', event);
    this.formulainput = false;
    this.parameterdiv = false;
    this.editformula = false;
    this.isFormulaReadOnly = false;
  }
}
