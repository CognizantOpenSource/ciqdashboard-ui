import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionFunnelComponent } from './chart-fusion-funnel.component';

describe('ChartFusionFunnelComponent', () => {
  let component: ChartFusionFunnelComponent;
  let fixture: ComponentFixture<ChartFusionFunnelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionFunnelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionFunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
