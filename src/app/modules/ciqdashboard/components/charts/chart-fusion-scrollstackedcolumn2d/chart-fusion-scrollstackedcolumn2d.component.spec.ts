import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionScrollstackedcolumn2dComponent } from './chart-fusion-scrollstackedcolumn2d.component';

describe('ChartFusionScrollstackedcolumn2dComponent', () => {
  let component: ChartFusionScrollstackedcolumn2dComponent;
  let fixture: ComponentFixture<ChartFusionScrollstackedcolumn2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionScrollstackedcolumn2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionScrollstackedcolumn2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
