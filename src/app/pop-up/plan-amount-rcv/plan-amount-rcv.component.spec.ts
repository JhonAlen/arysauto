import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAmountRcvComponent } from './plan-amount-rcv.component';

describe('PlanAmountRcvComponent', () => {
  let component: PlanAmountRcvComponent;
  let fixture: ComponentFixture<PlanAmountRcvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanAmountRcvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanAmountRcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
