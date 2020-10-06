import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarHorizontalStackedComponent } from './chart-bar-horizontal-stacked.component';

describe('ChartBarHorizontalStackedComponent', () => {
  let component: ChartBarHorizontalStackedComponent;
  let fixture: ComponentFixture<ChartBarHorizontalStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBarHorizontalStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarHorizontalStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
