import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSearchProviderComponent } from './notification-search-provider.component';

describe('NotificationSearchProviderComponent', () => {
  let component: NotificationSearchProviderComponent;
  let fixture: ComponentFixture<NotificationSearchProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationSearchProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSearchProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
