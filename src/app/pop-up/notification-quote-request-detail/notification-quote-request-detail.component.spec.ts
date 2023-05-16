import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationQuoteRequestDetailComponent } from './notification-quote-request-detail.component';

describe('NotificationQuoteRequestDetailComponent', () => {
  let component: NotificationQuoteRequestDetailComponent;
  let fixture: ComponentFixture<NotificationQuoteRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationQuoteRequestDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationQuoteRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
