import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestProviderComponent } from './service-request-provider.component';

describe('ServiceRequestProviderComponent', () => {
  let component: ServiceRequestProviderComponent;
  let fixture: ComponentFixture<ServiceRequestProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
