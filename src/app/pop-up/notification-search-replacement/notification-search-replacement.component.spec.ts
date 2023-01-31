import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSearchReplacementComponent } from './notification-search-replacement.component';

describe('NotificationSearchReplacementComponent', () => {
  let component: NotificationSearchReplacementComponent;
  let fixture: ComponentFixture<NotificationSearchReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationSearchReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSearchReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
