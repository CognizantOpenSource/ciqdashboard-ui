import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionHeatmapComponent } from './chart-fusion-heatmap.component';

describe('ChartFusionHeatmapComponent', () => {
  let component: ChartFusionHeatmapComponent;
  let fixture: ComponentFixture<ChartFusionHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
