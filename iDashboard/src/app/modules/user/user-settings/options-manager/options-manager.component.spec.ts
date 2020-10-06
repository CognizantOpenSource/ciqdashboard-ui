import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsManagerComponent } from './options-manager.component';

describe('OptionsManagerComponent', () => {
  let component: OptionsManagerComponent;
  let fixture: ComponentFixture<OptionsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
