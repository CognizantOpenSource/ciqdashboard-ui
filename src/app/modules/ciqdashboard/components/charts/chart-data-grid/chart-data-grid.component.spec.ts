import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDataGridComponent } from './chart-data-grid.component';

describe('ChartDataGridComponent', () => {
  let component: ChartDataGridComponent;
  let fixture: ComponentFixture<ChartDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
