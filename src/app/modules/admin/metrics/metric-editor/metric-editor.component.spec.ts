import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricEditorComponent } from './metric-editor.component';

describe('MetricEditorComponent', () => {
  let component: MetricEditorComponent;
  let fixture: ComponentFixture<MetricEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
