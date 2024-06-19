import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionPie2dComponent } from './chart-fusion-pie2d.component';

describe('ChartFusionPie2dComponent', () => {
  let component: ChartFusionPie2dComponent;
  let fixture: ComponentFixture<ChartFusionPie2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionPie2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionPie2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
