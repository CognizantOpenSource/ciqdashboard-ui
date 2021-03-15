import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPolarComponent } from './chart-polar.component';

describe('ChartPolarComponent', () => {
  let component: ChartPolarComponent;
  let fixture: ComponentFixture<ChartPolarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPolarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
