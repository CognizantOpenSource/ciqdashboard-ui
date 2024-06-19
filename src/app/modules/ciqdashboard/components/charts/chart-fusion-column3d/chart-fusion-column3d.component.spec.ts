import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionColumn3dComponent } from './chart-fusion-column3d.component';

describe('ChartFusionColumn3dComponent', () => {
  let component: ChartFusionColumn3dComponent;
  let fixture: ComponentFixture<ChartFusionColumn3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionColumn3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionColumn3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
