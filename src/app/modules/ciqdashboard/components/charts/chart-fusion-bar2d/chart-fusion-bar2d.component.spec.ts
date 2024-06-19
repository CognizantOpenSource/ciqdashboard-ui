import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionBar2dComponent } from './chart-fusion-bar2d.component';

describe('ChartFusionBar2dComponent', () => {
  let component: ChartFusionBar2dComponent;
  let fixture: ComponentFixture<ChartFusionBar2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionBar2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionBar2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
