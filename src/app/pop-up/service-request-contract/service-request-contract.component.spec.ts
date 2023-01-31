import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestContractComponent } from './service-request-contract.component';

describe('ServiceRequestContractComponent', () => {
  let component: ServiceRequestContractComponent;
  let fixture: ComponentFixture<ServiceRequestContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
