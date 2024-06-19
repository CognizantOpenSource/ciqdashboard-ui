import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionPie3dComponent } from './chart-fusion-pie3d.component';

describe('ChartFusionPie3dComponent', () => {
  let component: ChartFusionPie3dComponent;
  let fixture: ComponentFixture<ChartFusionPie3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionPie3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionPie3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
