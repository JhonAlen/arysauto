import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyQuotationIndexComponent } from './policy-quotation-index.component';

describe('PolicyQuotationIndexComponent', () => {
  let component: PolicyQuotationIndexComponent;
  let fixture: ComponentFixture<PolicyQuotationIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyQuotationIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyQuotationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
