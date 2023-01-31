import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracingMotiveIndexComponent } from './tracing-motive-index.component';

describe('TracingMotiveIndexComponent', () => {
  let component: TracingMotiveIndexComponent;
  let fixture: ComponentFixture<TracingMotiveIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracingMotiveIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracingMotiveIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
