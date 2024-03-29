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
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgDateRangePickerComponent } from 'ng-daterangepicker';
/**
* DatePickerInputComponent
* @author Cognizant
*/
@Component({
  selector: 'app-date-picker-input',
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DatePickerInputComponent,
    multi: true
  }],
})
export class DatePickerInputComponent implements OnInit, ControlValueAccessor {

  value: string;
  private _datePicker;
  @ViewChild(NgDateRangePickerComponent, { static: false }) set datePicker(datePicker: NgDateRangePickerComponent) {
    this._datePicker = datePicker;
    this.setDefValue();
  };
  @Input('value') set setValue(dateValue: any) {
    if (dateValue && !this.value) {
      let newValue;
      if (dateValue.maxValue) {
        newValue = this.toDateStr(dateValue.value) + '-' + this.toDateStr(dateValue.maxValue);
        this.setDefValue();
      } else {
        newValue = this.toDateStr(dateValue.value)
      }
      this.value = newValue;
    }
  }
  @Input() isRange = false;
  @Output() valueChange = new EventEmitter<any>();
  dateOptions = {
    theme: 'default',
    range: '',
    dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    presetNames: ['This Month', 'Last Month', 'This Week', 'Last Week', 'This Year', 'Last Year', 'Start', 'End'],
    dateFormat: 'MMM dd yyyy',
    outputFormat: 'MM/DD/YYYY',
    startOfWeek: 1,
  };
  onFormChange: any = () => undefined;
  constructor() { }

  ngOnInit() {
  }
  private setDefValue() {
    setTimeout(() => {
      if (this._datePicker && this.value) {
        const values = this.value.split('-');
        this._datePicker.date = values[0] && values[0] !== '' ? new Date(values[0]) : new Date();
        this._datePicker.dateFrom = this._datePicker.date;
        this._datePicker.dateTo = values[1] && values[1] !== '' ? new Date(values[1]) : this._datePicker.dateFrom;
        this._datePicker.generateCalendar();
      }
    });
  }
  private toDateStr(dateValue) {
    if (dateValue) {
      const date = new Date(dateValue);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
    this.onFormChange = fn;
  }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }

  private onChange(value) {
    this.valueChange.emit(value);
  }
  public onRangeValueChange(value: string) {
    if (value) {
      const values = value.split('-');
      const date = new Date(values[0] + ' 12:00:00');
      const maxDate = new Date(values[1] + ' 12:00:00');
      if (isValidDate(date) && isValidDate(maxDate)) {
        this.onChange({ value: toISOString(date), maxValue: toISOString(maxDate) });
      }
    }
  }
  public onValueChange(value) {
    if (value) {
      const date = new Date(value + ' 12:00:00');
      this.onChange({ value: toISOString(date) });
    }
  }
}
function toISOString(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${date.getFullYear()}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}T00:00:00.000Z`
}
function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d as unknown as number);
}
