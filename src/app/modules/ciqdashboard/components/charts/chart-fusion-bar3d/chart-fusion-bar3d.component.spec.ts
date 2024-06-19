import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionBar3dComponent } from './chart-fusion-bar3d.component';

describe('ChartFusionBar3dComponent', () => {
  let component: ChartFusionBar3dComponent;
  let fixture: ComponentFixture<ChartFusionBar3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionBar3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionBar3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
