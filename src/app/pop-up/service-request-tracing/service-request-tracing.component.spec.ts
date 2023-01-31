import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestTracingComponent } from './service-request-tracing.component';

describe('ServiceRequestTracingComponent', () => {
  let component: ServiceRequestTracingComponent;
  let fixture: ComponentFixture<ServiceRequestTracingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestTracingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
