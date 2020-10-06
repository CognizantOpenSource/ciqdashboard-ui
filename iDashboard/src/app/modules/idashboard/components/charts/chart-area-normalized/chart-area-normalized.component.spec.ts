import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAreaNormalizedComponent } from './chart-area-normalized.component';

describe('ChartAreaNormalizedComponent', () => {
  let component: ChartAreaNormalizedComponent;
  let fixture: ComponentFixture<ChartAreaNormalizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartAreaNormalizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAreaNormalizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
