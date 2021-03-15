import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarVerticalStackedComponent } from './chart-bar-vertical-stacked.component';

describe('ChartBarVerticalStackedComponent', () => {
  let component: ChartBarVerticalStackedComponent;
  let fixture: ComponentFixture<ChartBarVerticalStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBarVerticalStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarVerticalStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
