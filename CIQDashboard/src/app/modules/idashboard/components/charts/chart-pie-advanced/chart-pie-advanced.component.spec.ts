import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAdvancedPieChartComponent } from './chart-advanced-pie-chart.component';

describe('ChartAdvancedPieChartComponent', () => {
  let component: ChartAdvancedPieChartComponent;
  let fixture: ComponentFixture<ChartAdvancedPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartAdvancedPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAdvancedPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
