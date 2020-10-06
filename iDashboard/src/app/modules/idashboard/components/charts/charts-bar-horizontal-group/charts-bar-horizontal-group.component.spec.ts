import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsBarHorizontalGroupComponent } from './charts-bar-horizontal-group.component';

describe('ChartsBarHorizontalGroupComponent', () => {
  let component: ChartsBarHorizontalGroupComponent;
  let fixture: ComponentFixture<ChartsBarHorizontalGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsBarHorizontalGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsBarHorizontalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
