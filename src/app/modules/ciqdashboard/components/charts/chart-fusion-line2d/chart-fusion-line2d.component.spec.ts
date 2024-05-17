import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionLine2dComponent } from './chart-fusion-line2d.component';

describe('ChartFusionLine2dComponent', () => {
  let component: ChartFusionLine2dComponent;
  let fixture: ComponentFixture<ChartFusionLine2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionLine2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionLine2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
