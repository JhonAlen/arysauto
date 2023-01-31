import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAlertDetailComponent } from './email-alert-detail.component';

describe('EmailAlertDetailComponent', () => {
  let component: EmailAlertDetailComponent;
  let fixture: ComponentFixture<EmailAlertDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAlertDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAlertDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
