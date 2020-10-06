import { Component, OnInit, Input , ChangeDetectionStrategy} from '@angular/core';

export interface IExecutionAnalysis {
  total: number;
  today: number;
  entries: Array<any>;
  status: { passed?: number; failed?: number; skipped?: number };
  duration: { min: number; max: number; avg: number };
  itsDuration: number;
}
export interface IInfo {
  title?: string;
  value: number | string;
  subTitle?: string;
  color?: string
  sep?: boolean
}
export interface IInfoCard {
  type: 'info' | 'diff' | 'compare';
  values: IInfo[];
  base?: number;
}
@Component({
  selector: 'leap-info-bar-report',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class InfoBarReportComponent implements OnInit {

  static it = InfoBarReportComponent.name;

  @Input() stats: IInfoCard[];
  @Input() set unit(unit: 's|m|ms') {

  }
  unitConversion = 0.001

  ngOnInit() {

  }

  abs(val) {
    return Math.abs(val);
  }
  asNum(val: string): number {
    return +val;
  }

  getTextClassByLength(text) {
    if (text) {
      if (text.length < 6) {
        return 'text-4';
      }
      if (text.length < 10) {
        return 'text-5';
      }
      return 'text-6';
    } else {
      return 'text-4';
    }
  }
}
