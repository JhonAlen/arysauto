import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationQuoteComponent } from './notification-quote.component';

describe('NotificationQuoteComponent', () => {
  let component: NotificationQuoteComponent;
  let fixture: ComponentFixture<NotificationQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
