import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracingTypeDetailComponent } from './tracing-type-detail.component';

describe('TracingTypeDetailComponent', () => {
  let component: TracingTypeDetailComponent;
  let fixture: ComponentFixture<TracingTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracingTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracingTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
