import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-fusion-bar-vertical-group',
  templateUrl: './chart-fusion-bar-vertical-group.component.html',
  styleUrls: ['../base-chart.scss' ,'./chart-fusion-bar-vertical-group.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
})
export class ChartFusionBarVerticalGroupComponent extends BaseChart implements OnInit {

  
  chartInstance: any = {};
  data: any;
  dataSource: any;
  dataSource1:any;

@Input('data') set setData(data: any) {
  this.data = data;
  this.setupdataconfig(data);
  //console.log('datagroup',this.data);
}
// @Input() set config(config: any) {
//   this.setConfig(config);
// }
@Input() set config(config: any) {
    this.setConfig(config);
    this.setupdataconfig(config);
    //console.log('configgg',config);
  //   this.dataSource = {
  //     "chart": {
  //       "theme": "fusion",
  //       "caption": "Quality Metrics",
  //       "xAxisname": "Projects",
  //       "yAxisName": "Coverage (In %)",
  //       //"numberPrefix": "$",
	// 	    "numberSuffix": "%",
  //       "plotFillAlpha": "80",
  //       "divLineIsDashed": "1",
  //       "divLineDashLen": "1",
  //       "divLineGapLen": "1",
  //       "showValues" : "1",
  //       "yAxisMaxValue" : 100
  //   },
  //   "categories": [
  //       {
  //           "category": [
  //               {
  //                   "label": "PrjA"
  //               },
  //               {
  //                   "label": "PrjB"
  //               },
  //               {
  //                   "label": "PrjC"
  //               },
  //               {
  //                   "label": "PrjD"
  //               }
  //           ]
  //       }
  //   ],
  //   "dataset": [
  //       {
  //           "seriesname": "Automation Coverage",
  //           "data": [
  //               {
  //                   "value": 80,
  //                   "link" : "http://localhost:4200/#/ciqdashboard/6418498fb32ab46f2a9d3824/dashboards/64184a0eb32ab46f2a9d3828;page=0?category=project"
  //               },
  //               {
  //                   "value": 65
  //               },
  //               {
  //                   "value":0
  //               },
  //               {
  //                   "value": 100
  //               }
  //           ]
  //       },
  //       {
  //           "seriesname": "Defect Density",
  //           "data": [
  //               {
  //                   "value": 77,
  //               },
  //               {
  //                   "value": 68
  //               },
  //               {
  //                   "value": 100
  //               },
  //               {
  //                   "value": 15
  //               }
  //           ]
  //       }
  //   ]
  // }

    // "trendlines": [
    //     {
    //         "line": [
    //             {
    //                 "startvalue": "65",
    //                 "color": "#5D62B5",
    //                 //"displayvalue": "Automation Coverage{br}Average",
    //                 "valueOnRight": "1",
    //                 "thickness": "1",
    //                 "showBelow": "1",
    //                 "tooltext": "Automation Average  : 55"
    //             },
    //             {
    //                 "startvalue": "45",
    //                 "color": "#29C3BE",
    //                 "displayvalue": "Performance Coverage{br}Average",
    //                 "valueOnRight": "1",
    //                 "thickness": "1",
    //                 "showBelow": "1",
    //                 "tooltext": "Performance Average  : 38"
    //             }
    //         ]
    //     }
    // ]
    // }
  //   this.dataSource = {
  //     "chart": {
  //       "theme": "fusion",
  //       "caption": "Comparison of Quarterly Revenue",
  //       "xAxisname": "Quarter",
  //       "yAxisName": "Revenues (In USD)",
  //       "numberPrefix": "$",
  //       "plotFillAlpha": "80",
  //       "divLineIsDashed": "1",
  //       "divLineDashLen": "1",
  //       "divLineGapLen": "1"
  //     },
  //     "categories": [
  //       {
  //           "category": [
  //               {
  //                   "label": "Q1"
  //               },
  //               {
  //                   "label": "Q2"
  //               },
  //               {
  //                   "label": "Q3"
  //               },
  //               {
  //                   "label": "Q4"
  //               }
  //           ]
  //       }
  //   ],
  //   "dataset": [
  //       {
  //           "seriesname": "Previous Year",
  //           "data": [
  //               {
  //                   "value": "10000",
  //                   "link": "http://localhost:4200/#/ciqdashboard/64130aa1a5bc6353af8dbc4a/dashboards/64130c94421d287ba6034d45;page=0?category=project"
  //               },
  //               {
  //                   "value": "11500"
  //               },
  //               {
  //                   "value": "12500"
  //               },
  //               {
  //                   "value": "15000"
  //               }
  //           ]
  //       },
  //       {
  //           "seriesname": "Current Year",
  //           "data": [
  //               {
  //                   "value": "25400"
  //               },
  //               {
  //                   "value": "29800"
  //               },
  //               {
  //                   "value": "21800"
  //               },
  //               {
  //                   "value": "26800"
  //               }
  //           ]
  //       }
  //   ]
  // };
   // this.datasourceFinal = Object.assign({}, this.dataSource1);
  //   this.dataSource = { "chart": {
  //     "caption": config.caption,
  //     "xAxisname": config.xaxisname,
  //     "yAxisName": config.yaxisname,
  //     "showLegend": "1",
  //     "plotHighlightEffect": "fadeout",
  //     //"numberprefix": "$",
  //     "theme": "fusion",
  //     "rotateValues": "0",
  //     "palettecolors": config.colors,
  //     //"legendPosition": config.fusionlegendPosition,
  //     "legendAllowDrag": "1",
  //     "Hyperlink": config.Hyperlinks
  // },"data":this.dataSource1,
  // //"linkeddata":this.dataSource1[0].linkeddata
    
};
width: string="";
height: string="";
constructor(private zone: NgZone) { 
  super();
}

  ngOnInit() {
    this.width= "100%";
    this.height= "100%";
  }
  setupdataconfig(config){
    this.dataSource1 = this.data;
    //"link": "/#/ciqdashboard/6413088b6d3c127a0a86d32a/dashboards/64130af7421d287ba6034d40;page=0?category=project"
    const host = `http://${window.location.hostname}:${window.location.port}/ciqdashboard/#/ciqdashboard/`;
    // console.log('hostname',host);
    // console.log('datasourcedata',this.dataSource1);
    this.dataSource1.forEach((element,index) => {
      element.link = host + element.link;
      //console.log('elementlink',element.link);
    });
    //console.log('dataVerticalChart',this.dataSource1);
    this.dataSource = { "chart": {
      "caption": config.caption,
      "xaxisname": config.xaxisname,
      "yaxisname": config.yaxisname,
      "theme": "fusion",
      //"numberPrefix": "$",
      "numberSuffix": "%",
      //"numberSuffix": config.numberSuffix,
      "plotFillAlpha": "80",
      "divLineIsDashed": "1",
      "divLineDashLen": "1",
      "divLineGapLen": "1",
      "showValues" : "1",
      "yAxisMaxValue" : 100
  },
  "categories" : this.dataSource1[0].categories,
  "dataset" : this.dataSource1[0].dataset
  //"linkeddata":this.dataSource1[0].linkeddata
    
    };
    //console.log(this.dataSource);
  }

}
