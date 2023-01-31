import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTypeDetailComponent } from './notification-type-detail.component';

describe('NotificationTypeDetailComponent', () => {
  let component: NotificationTypeDetailComponent;
  let fixture: ComponentFixture<NotificationTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
