import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationQuoteRequestIndexComponent } from './notification-quote-request-index.component';

describe('NotificationQuoteRequestIndexComponent', () => {
  let component: NotificationQuoteRequestIndexComponent;
  let fixture: ComponentFixture<NotificationQuoteRequestIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationQuoteRequestIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationQuoteRequestIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
