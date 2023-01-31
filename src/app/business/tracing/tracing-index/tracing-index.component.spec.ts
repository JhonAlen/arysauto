import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracingIndexComponent } from './tracing-index.component';

describe('TracingIndexComponent', () => {
  let component: TracingIndexComponent;
  let fixture: ComponentFixture<TracingIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracingIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracingIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
