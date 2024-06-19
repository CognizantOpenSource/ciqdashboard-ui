import { Component, Input, NgZone, OnInit } from '@angular/core';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'app-chart-fusion-doughnut3d',
  templateUrl: './chart-fusion-doughnut3d.component.html',
  styleUrls: ['./chart-fusion-doughnut3d.component.scss']
})
export class ChartFusionDoughnut3dComponent extends BaseChart implements OnInit {

  chartInstance: any = {};
  data: any;
  dataSource: any;
  dataSource1:any;
  // Callback to get chart instance
  initialized(e) {
    this.chartInstance = e.chart; // Save it for further use

    // Configure Drilldown attributes
    this.chartInstance.configureLink({
        type: "doughnut3d",
        width:"100%",
        height:"100%",
        overlayButton: {
            message: 'close',
            fontColor: '880000',
            bgColor: 'FFEEEE',
            borderColor: '660000'
        }
    }, 0)
}
@Input('data') set setData(data: any) {
  this.data = data;
  this.setupdataconfig(data);
}
// @Input() set config(config: any) {
//   this.setConfig(config);
// }
@Input() set config(config: any) {
    this.setConfig(config);
    this.setupdataconfig(config);
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
   // this.datasourceFinal = Object.assign({}, this.dataSource1);
   //console.log('dataSource1',this.dataSource1);
    this.dataSource = { "chart": {
      "caption": config.caption,
      "subcaption": config.subcaption,
      //"xaxisname": config.xaxisname,
      //"yaxisname": config.yaxisname,
     // "showLegend": "1",
      //"plotHighlightEffect": "fadeout",
      //"numberprefix": "$",
      //"numberSuffix": "%",
      "theme": "fusion",
      //"rotateValues": "0",
      "palettecolors": config.colors,
      //"legendPosition": config.fusionlegendPosition
      //"legendAllowDrag": "1",
      //"showValues" : "1",
      //"Hyperlink": config.Hyperlinks
  },"data":this.dataSource1,
  //"linkeddata":this.dataSource1[0].linkeddata

    };
    //console.log(this.dataSource);
  }
}
