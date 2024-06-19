import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-fusion-bar-vertical-stacked',
  templateUrl: './chart-fusion-bar-vertical-stacked.component.html',
  styleUrls: ['../base-chart.scss' ,'./chart-fusion-bar-vertical-stacked.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
})
export class ChartFusionBarVerticalStackedComponent extends BaseChart implements OnInit {

   
  chartInstance: any = {};
  data: any;
  dataSource: any;
  dataSource1:any;

@Input('data') set setData(data: any) {
  //console.log('dataaVerticalStaked',data);
  this.data = data;
  this.setupdataconfig(data);
}
// @Input() set config(config: any) {
//   this.setConfig(config);
// }
@Input() set config(config: any) {
  this.setConfig(config);
  this.setupdataconfig(config);
    //console.log('configgg',config);
//     this.dataSource = {
//       "chart": {
//           "caption": "Execution Progress",
//           //"subCaption": "Harry's SuperMart",
//           "xAxisname": "Tracks - Drops",
//           "yAxisName": "Test Cases Count",
//           //"numberPrefix": "$",
//           //"numberSuffix": "%",
//           "theme": "fusion",
//           "showValues" : "1",
//           "palettecolors": "#00FF00,#FF0000,#C0C0C0,#6284A6",
//           "yAxisMaxValue" : 100,
//           "showSum": "1",
//       },
//       "categories": [
//         {
//             "category": [
//                 {
//                     "label": "O2C-5A"
//                 },
//                 {
//                     "label": "C2M-Drop1"
//                 },
//                 {
//                     "label": "C2M-Drop2"
//                 },
//                 {
//                     "label": "T2R-Drop2"
//                 }
//             ]
//         }
//     ],
//     "dataset": [
//       {
//           "seriesname": "Passed",
//           "data": [
//               {
//                   "value": "73",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "89",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "123",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=0?category=project"
//               },
//               {
//                   "value": "12",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64758c3bae02fb493b861433/dashboards/6480f57f2e05063eecbc5226;page=1?category=project"
//               }
//           ]
//       },{
//           "seriesname": "Failed",
//           "data": [
//               {
//                   "value": "15",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "18",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "33",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=0?category=project"
//               },
//               {
//                   "value": "9",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64758c3bae02fb493b861433/dashboards/6480f57f2e05063eecbc5226;page=1?category=project"
//               }
//           ]
//       },{
//           "seriesname": "Blocked",
//           "data": [
//               {
//                   "value": "33",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "11",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "13",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=0?category=project"
//               },
//               {
//                   "value": "12",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64758c3bae02fb493b861433/dashboards/6480f57f2e05063eecbc5226;page=1?category=project"
//               }
//           ]
//       },{
//           "seriesname": "No Run",
//           "data": [
//               {
//                   "value": "23",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "22",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=1?category=project"
//               },
//               {
//                   "value": "98",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64748836ae02fb493b861416/dashboards/64754449ae02fb493b86141e;page=0?category=project"
//               },
//               {
//                   "value": "23",
//                   "link" : "http://localhost/ciqdashboard/#/ciqdashboard/64758c3bae02fb493b861433/dashboards/6480f57f2e05063eecbc5226;page=1?category=project"
//               }
//           ]
//       }

// ]
//   }

    //StartOfStaticData
  //   this.dataSource = {
  //     "chart": {
  //         "caption": "Project-wise Automation and Manual Tests",
  //         "subCaption": "Automation Vs. Manual",
  //         "xAxisname": "Projects",
  //         "yAxisName": "Tests",
  //         "numberSuffix": "%",
  //         "theme": "fusion",
  //         "showValues" : 1,
  //         "yAxisMaxValue" : 100
  //     },
  //     "categories": [
  //         {
  //             "category": [
  //                 {
  //                     "label": "ProjA"
  //                 },
  //                 {
  //                     "label": "ProjB"
  //                 },
  //                 {
  //                     "label": "ProjC"
  //                 },
  //                 {
  //                     "label": "ProjD"
  //                 }
  //             ]
  //         }
  //     ],
  //     "dataset": [
  //         {
  //             "seriesname": "Automation",
  //             "data": [
  //                 {
  //                     "value": "88",
  //                     "link" : "http://localhost:4200/#/ciqdashboard/64184975b32ab46f2a9d3823/dashboards/64184a36b32ab46f2a9d3829;page=0?category=project"
  //                 },
  //                 {
  //                     "value": "46"
  //                 },
  //                 {
  //                     "value": "98"
  //                 },
  //                 {
  //                     "value": "0"
  //                 }
  //             ]
  //         },
  //         {
  //             "seriesname": "Manual",
  //             "data": [
  //                 {
  //                     "value": "22"
  //                 },
  //                 {
  //                     "value": "89"
  //                 },
  //                 {
  //                     "value": "22"
  //                 },
  //                 {
  //                     "value": "16"
  //                 }
  //             ]
  //         }
  //     ]
  // }
  //EndofStaticData
  //   this.dataSource = {
  //     "chart": {
  //       "caption": "Product-wise quarterly revenue in current year",
  //       "subCaption": "Harry's SuperMart",
  //       "xAxisname": "Quarter",
  //       "yAxisName": "Revenue (In USD)",
  //       "numberPrefix": "$",
  //       "theme": "fusion"
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
  //           "seriesname": "Food Products",
  //           "data": [
  //               {
  //                   "value": "121000"
  //               },
  //               {
  //                   "value": "135000"
  //               },
  //               {
  //                   "value": "123500"
  //               },
  //               {
  //                   "value": "145000"
  //               }
  //           ]
  //       },
  //       {
  //           "seriesname": "Non-Food Products",
  //           "data": [
  //               {
  //                   "value": "131400"
  //               },
  //               {
  //                   "value": "154800"
  //               },
  //               {
  //                   "value": "98300"
  //               },
  //               {
  //                   "value": "131800"
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
    
  //   };
}
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
      //"numberSuffix": "%",
      //"numberSuffix": config.numberSuffix,
      "palettecolors": config.colors,
      "yAxisMaxValue" : 100,
      "showValues" : "1",
      "showSum": "1"
  },
  "categories" : this.dataSource1[0].categories,
  "dataset" : this.dataSource1[0].dataset
  //"linkeddata":this.dataSource1[0].linkeddata
    
    };
    //console.log(this.dataSource);
  }
}
