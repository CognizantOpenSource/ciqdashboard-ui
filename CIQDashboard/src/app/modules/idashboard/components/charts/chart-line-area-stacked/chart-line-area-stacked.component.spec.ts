import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineAreaStackedComponent } from './chart-line-area-stacked.component';

describe('ChartLineAreaStackedComponent', () => {
  let component: ChartLineAreaStackedComponent;
  let fixture: ComponentFixture<ChartLineAreaStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartLineAreaStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineAreaStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
