import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionLinearscaleComponent } from './chart-fusion-linearscale.component';

describe('ChartFusionLinearscaleComponent', () => {
  let component: ChartFusionLinearscaleComponent;
  let fixture: ComponentFixture<ChartFusionLinearscaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionLinearscaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionLinearscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
