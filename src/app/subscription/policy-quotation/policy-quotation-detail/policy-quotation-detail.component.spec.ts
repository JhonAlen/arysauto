import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyQuotationDetailComponent } from './policy-quotation-detail.component';

describe('PolicyQuotationDetailComponent', () => {
  let component: PolicyQuotationDetailComponent;
  let fixture: ComponentFixture<PolicyQuotationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyQuotationDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyQuotationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
