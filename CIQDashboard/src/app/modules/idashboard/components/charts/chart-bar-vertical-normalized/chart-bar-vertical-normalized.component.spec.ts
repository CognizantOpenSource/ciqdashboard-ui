import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarVerticalNormalizedComponent } from './chart-bar-vertical-normalized.component';

describe('ChartBarVerticalNormalizedComponent', () => {
  let component: ChartBarVerticalNormalizedComponent;
  let fixture: ComponentFixture<ChartBarVerticalNormalizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBarVerticalNormalizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarVerticalNormalizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
