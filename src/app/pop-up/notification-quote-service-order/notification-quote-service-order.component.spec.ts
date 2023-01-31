import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationQuoteServiceOrderComponent } from './notification-quote-service-order.component';

describe('NotificationQuoteServiceOrderComponent', () => {
  let component: NotificationQuoteServiceOrderComponent;
  let fixture: ComponentFixture<NotificationQuoteServiceOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationQuoteServiceOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationQuoteServiceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
