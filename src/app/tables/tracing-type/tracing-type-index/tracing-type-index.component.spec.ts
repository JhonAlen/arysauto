import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracingTypeIndexComponent } from './tracing-type-index.component';

describe('TracingTypeIndexComponent', () => {
  let component: TracingTypeIndexComponent;
  let fixture: ComponentFixture<TracingTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracingTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracingTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
