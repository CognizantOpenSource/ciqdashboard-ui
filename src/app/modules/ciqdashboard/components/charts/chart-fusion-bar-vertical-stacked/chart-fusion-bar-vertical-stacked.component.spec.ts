import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionBarVerticalStackedComponent } from './chart-fusion-bar-vertical-stacked.component';

describe('ChartFusionBarVerticalStackedComponent', () => {
  let component: ChartFusionBarVerticalStackedComponent;
  let fixture: ComponentFixture<ChartFusionBarVerticalStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionBarVerticalStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionBarVerticalStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
