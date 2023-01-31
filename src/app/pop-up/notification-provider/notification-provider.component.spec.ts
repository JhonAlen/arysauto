import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationProviderComponent } from './notification-provider.component';

describe('NotificationProviderComponent', () => {
  let component: NotificationProviderComponent;
  let fixture: ComponentFixture<NotificationProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
