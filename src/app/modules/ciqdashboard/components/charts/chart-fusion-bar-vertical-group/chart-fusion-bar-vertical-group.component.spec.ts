import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFusionBarVerticalGroupComponent } from './chart-fusion-bar-vertical-group.component';

describe('ChartFusionBarVerticalGroupComponent', () => {
  let component: ChartFusionBarVerticalGroupComponent;
  let fixture: ComponentFixture<ChartFusionBarVerticalGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFusionBarVerticalGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFusionBarVerticalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
