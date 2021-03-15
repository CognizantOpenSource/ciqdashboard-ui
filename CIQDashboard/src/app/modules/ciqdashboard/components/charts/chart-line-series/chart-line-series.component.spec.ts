import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineSeriesComponent } from './chart-line-series.component';

describe('ChartLineSeriesComponent', () => {
  let component: ChartLineSeriesComponent;
  let fixture: ComponentFixture<ChartLineSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartLineSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
