import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarNormalizedComponent } from './chart-bar-horizontal-normalized.component';

describe('ChartBarNormalizedComponent', () => {
  let component: ChartBarNormalizedComponent;
  let fixture: ComponentFixture<ChartBarNormalizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBarNormalizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarNormalizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
