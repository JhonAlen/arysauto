import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAlertRoleComponent } from './email-alert-role.component';

describe('EmailAlertRoleComponent', () => {
  let component: EmailAlertRoleComponent;
  let fixture: ComponentFixture<EmailAlertRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAlertRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAlertRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
