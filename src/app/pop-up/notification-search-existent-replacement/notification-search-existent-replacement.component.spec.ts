import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSearchExistentReplacementComponent } from './notification-search-existent-replacement.component';

describe('NotificationSearchExistentReplacementComponent', () => {
  let component: NotificationSearchExistentReplacementComponent;
  let fixture: ComponentFixture<NotificationSearchExistentReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationSearchExistentReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSearchExistentReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
