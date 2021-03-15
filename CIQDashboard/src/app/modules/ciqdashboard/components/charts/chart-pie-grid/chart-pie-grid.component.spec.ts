import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPieGridComponent } from './chart-pie-grid.component';

describe('ChartPieGridComponent', () => {
  let component: ChartPieGridComponent;
  let fixture: ComponentFixture<ChartPieGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPieGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPieGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
