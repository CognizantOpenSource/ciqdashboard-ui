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
import { flatten } from '@angular/compiler';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'
/**
* ChartCardComponent
* @author Cognizant
*/
@Component({
  selector: "app-chart-card",
  templateUrl: "./chart-card.component.html",
  styleUrls: ["./chart-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartCardComponent extends BaseChart implements OnInit {

  data:any;
  previouspercent=false;
  loopval:any;
  //@Input('data') data: any;
  @Input('data') set setData(data: any) {
    this.data = data;
    //console.log('carddata',typeof(this.data));
    //console.log('dataafterappend',this.data);
  }
  @Input('config') set config(config: any) {
    //console.log('configgg',config,this.previouspercent,config.percentage);
    this.callpercentage(config);
    this.data.forEach(element => {
      element.name =" "
    });
    this.setConfig(config);
    //console.log('dataaavalueee',this.data,this.previouspercent,config.percentage);
  }
  constructor() {
    super();
  }
  callpercentage(config){
    if(config.percentage == true){
      this.data.forEach(element => {
        let dataofvalue = element.value;
        let percent = "%";
        //console.log('elementvalue',typeof(dataofvalue));
        if(typeof(dataofvalue)){
          if(dataofvalue.toString().includes(percent)){
          }
          else{
            element.value = element.value + '%';
          }
        }
      });
    }
    else{
      this.data.forEach(element => {
        let dataofvalue = element.value;
        //console.log('dataofvalue123',typeof(dataofvalue));
        if(typeof(dataofvalue)=="string"){
          //console.log('trueee123');
          element.value = element.value.replace("%","");
        }
      });
      //this.previouspercent = true;
    }
  }
  onSelect(event) {
    console.log('eventtriggering',event);
  }
  ngOnInit() {}
  
}
