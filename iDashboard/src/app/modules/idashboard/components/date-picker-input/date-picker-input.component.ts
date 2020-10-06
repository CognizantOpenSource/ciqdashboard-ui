import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgDateRangePickerComponent } from 'ng-daterangepicker';

@Component({
  selector: 'leap-date-picker-input',
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
        this._datePicker.date = new Date(values[0]);
        this._datePicker.dateFrom = new Date(values[0]);
        this._datePicker.dateTo = new Date(values[1]);
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
      const date = new Date(values[0]);
      const maxDate = new Date(values[1]);
      if (isValidDate(date) && isValidDate(maxDate))
        this.onChange({ value: date.toISOString(), maxValue: maxDate.toISOString() });
    }
  }
  public onValueChange(value) {
    if (value) {
      const date = new Date(value);
      this.onChange({ value: date.toISOString() });
    }
  }
}
function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d as unknown as number);
}
