import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTreeMapComponent } from './chart-tree-map.component';

describe('ChartTreeMapComponent', () => {
  let component: ChartTreeMapComponent;
  let fixture: ComponentFixture<ChartTreeMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartTreeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTreeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
