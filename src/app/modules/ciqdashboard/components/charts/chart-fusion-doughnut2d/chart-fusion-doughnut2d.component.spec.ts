import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionDoughnut2dComponent } from './chart-fusion-doughnut2d.component';

describe('ChartFusionDoughnut2dComponent', () => {
  let component: ChartFusionDoughnut2dComponent;
  let fixture: ComponentFixture<ChartFusionDoughnut2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionDoughnut2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionDoughnut2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
