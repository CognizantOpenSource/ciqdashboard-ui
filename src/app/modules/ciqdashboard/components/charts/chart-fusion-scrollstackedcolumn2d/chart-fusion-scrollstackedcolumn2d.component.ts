import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-fusion-scrollstackedcolumn2d',
  templateUrl: './chart-fusion-scrollstackedcolumn2d.component.html',
  styleUrls: ['../base-chart.scss' ,'./chart-fusion-scrollstackedcolumn2d.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartFusionScrollstackedcolumn2dComponent extends BaseChart implements OnInit {

  data: any;
  dataSource: any;
  dataSource1:any;

  @Input('data') set setData(data: any) {
    this.data = data;
    this.setupdataconfig(data);
  }
  @Input() set config(config: any) {
    this.setConfig(config);
    this.setupdataconfig(config);
    //console.log('configgg',config);
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
      "subCaption": config.subcaption,
      "xaxisname": config.xaxisname,
      "yaxisname": config.yaxisname,
      "theme": "fusion",
      "palettecolors": config.colors,
      "showvalues": "1",
      "stack100percent": "1",
      "plottooltext":
      "$label - $dataValue (<b>$percentValue</b>) $seriesName",
      "numberPrefix": config.numberPrefix,
      "numberSuffix" : config.numberSuffix
  },
  "categories" : this.dataSource1[0].categories,
  "dataset" : this.dataSource1[0].dataset
    };
    //console.log(this.dataSource);
  }

}
