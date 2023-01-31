import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationPaymentComponent } from './administration-payment.component';

describe('AdministrationPaymentComponent', () => {
  let component: AdministrationPaymentComponent;
  let fixture: ComponentFixture<AdministrationPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
