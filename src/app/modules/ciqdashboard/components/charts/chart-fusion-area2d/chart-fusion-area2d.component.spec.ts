import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionArea2dComponent } from './chart-fusion-area2d.component';

describe('ChartFusionArea2dComponent', () => {
  let component: ChartFusionArea2dComponent;
  let fixture: ComponentFixture<ChartFusionArea2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionArea2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionArea2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
