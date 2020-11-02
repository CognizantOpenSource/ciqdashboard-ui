import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-label',
  templateUrl: './display-label.component.html',
  styleUrls: ['./display-label.component.scss']
})
export class DisplayLabelComponent implements OnInit {

  constructor() { }

  isBold: boolean; isTextStyle: boolean;
  isItalic: boolean;
  fontSize: number;
  textColor: any;
  paddingRight;
  paddingLeft;
  paddingTop;
  paddingBottom;

  labelName: string;
  config:any;
  @Input('labelConfig') set setLabelConfig(labelConfig) {
    this.config =labelConfig;
    this.setItemProperties(labelConfig);

  }
  ngOnInit() {
  }

  setItemProperties(labelConfig) {
    this.labelName = labelConfig.LabelText;
    this.isTextStyle = labelConfig.TextStyle ? true : false;
    this.isBold = labelConfig.TextBold ? true : false;
    this.isItalic = labelConfig.TextItalic ? true : false;
    this.fontSize = labelConfig.FontSize ? labelConfig.FontSize : 10;
    //joystick control padding-left increase/decrease
    this.paddingLeft = labelConfig.PaddingLeft ? labelConfig.PaddingLeft: 0;
    this.paddingTop = labelConfig.PaddingTop ? labelConfig.PaddingTop: 0;
    this.textColor = labelConfig.TextColor ? labelConfig.TextColor : '#000000';
  }

  getLabelStyle() {
    let styles = {
      'font-size.px' : this.fontSize,
      'padding-left.px' : this.paddingLeft,
      'padding-top.px' :  this.paddingTop,
      'color' : this.textColor
    };
    return styles;
  }
}