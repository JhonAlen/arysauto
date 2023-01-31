import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteByFleetApprovalDetailComponent } from './quote-by-fleet-approval-detail.component';

describe('QuoteByFleetApprovalDetailComponent', () => {
  let component: QuoteByFleetApprovalDetailComponent;
  let fixture: ComponentFixture<QuoteByFleetApprovalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteByFleetApprovalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteByFleetApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
