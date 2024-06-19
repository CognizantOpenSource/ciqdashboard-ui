import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionColumn2dComponent } from './chart-fusion-column2d.component';

describe('ChartFusionColumn2dComponent', () => {
  let component: ChartFusionColumn2dComponent;
  let fixture: ComponentFixture<ChartFusionColumn2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionColumn2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionColumn2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
