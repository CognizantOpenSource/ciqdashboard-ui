import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsBarVerticalGroupComponent } from './charts-bar-vertical-group.component';

describe('ChartsBarVerticalGroupComponent', () => {
  let component: ChartsBarVerticalGroupComponent;
  let fixture: ComponentFixture<ChartsBarVerticalGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsBarVerticalGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsBarVerticalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
