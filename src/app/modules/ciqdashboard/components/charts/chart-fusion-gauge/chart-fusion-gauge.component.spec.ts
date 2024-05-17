import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionGaugeComponent } from './chart-fusion-gauge.component';

describe('ChartFusionGaugeComponent', () => {
  let component: ChartFusionGaugeComponent;
  let fixture: ComponentFixture<ChartFusionGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
