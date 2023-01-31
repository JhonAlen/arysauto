import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestIndexComponent } from './service-request-index.component';

describe('ServiceRequestIndexComponent', () => {
  let component: ServiceRequestIndexComponent;
  let fixture: ComponentFixture<ServiceRequestIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
