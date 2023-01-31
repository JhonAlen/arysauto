import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLoadingServiceOrderComponent } from './bill-loading-service-order.component';

describe('BillLoadingServiceOrderComponent', () => {
  let component: BillLoadingServiceOrderComponent;
  let fixture: ComponentFixture<BillLoadingServiceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillLoadingServiceOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillLoadingServiceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
