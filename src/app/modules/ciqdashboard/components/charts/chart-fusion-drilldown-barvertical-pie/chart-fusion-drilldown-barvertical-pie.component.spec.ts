import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionDrilldownBarverticalPieComponent } from './chart-fusion-drilldown-barvertical-pie.component';

describe('ChartFusionDrilldownBarverticalPieComponent', () => {
  let component: ChartFusionDrilldownBarverticalPieComponent;
  let fixture: ComponentFixture<ChartFusionDrilldownBarverticalPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionDrilldownBarverticalPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionDrilldownBarverticalPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
