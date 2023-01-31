import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracingMotiveDetailComponent } from './tracing-motive-detail.component';

describe('TracingMotiveDetailComponent', () => {
  let component: TracingMotiveDetailComponent;
  let fixture: ComponentFixture<TracingMotiveDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracingMotiveDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracingMotiveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
