import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionDoughnut3dComponent } from './chart-fusion-doughnut3d.component';

describe('ChartFusionDoughnut3dComponent', () => {
  let component: ChartFusionDoughnut3dComponent;
  let fixture: ComponentFixture<ChartFusionDoughnut3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionDoughnut3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionDoughnut3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
