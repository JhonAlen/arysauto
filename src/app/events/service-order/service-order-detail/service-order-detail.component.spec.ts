import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderDetailComponent } from './service-order-detail.component';

describe('ServiceOrderDetailComponent', () => {
  let component: ServiceOrderDetailComponent;
  let fixture: ComponentFixture<ServiceOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
