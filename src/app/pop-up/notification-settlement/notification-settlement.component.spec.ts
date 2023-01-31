import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSettlementComponent } from './notification-settlement.component';

describe('NotificationSettlementComponent', () => {
  let component: NotificationSettlementComponent;
  let fixture: ComponentFixture<NotificationSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
