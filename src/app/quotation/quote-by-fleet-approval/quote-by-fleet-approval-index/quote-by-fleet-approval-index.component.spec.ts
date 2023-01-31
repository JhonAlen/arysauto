import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteByFleetApprovalIndexComponent } from './quote-by-fleet-approval-index.component';

describe('QuoteByFleetApprovalIndexComponent', () => {
  let component: QuoteByFleetApprovalIndexComponent;
  let fixture: ComponentFixture<QuoteByFleetApprovalIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteByFleetApprovalIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteByFleetApprovalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
