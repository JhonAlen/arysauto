import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationRejectionLetterComponent } from './notification-rejection-letter.component';

describe('NotificationRejectionLetterComponent', () => {
  let component: NotificationRejectionLetterComponent;
  let fixture: ComponentFixture<NotificationRejectionLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationRejectionLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationRejectionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
