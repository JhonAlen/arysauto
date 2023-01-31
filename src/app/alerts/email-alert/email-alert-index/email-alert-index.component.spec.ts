import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAlertIndexComponent } from './email-alert-index.component';

describe('EmailAlertIndexComponent', () => {
  let component: EmailAlertIndexComponent;
  let fixture: ComponentFixture<EmailAlertIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAlertIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAlertIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
