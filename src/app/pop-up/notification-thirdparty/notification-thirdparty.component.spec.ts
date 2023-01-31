import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationThirdpartyComponent } from './notification-thirdparty.component';

describe('NotificationThirdpartyComponent', () => {
  let component: NotificationThirdpartyComponent;
  let fixture: ComponentFixture<NotificationThirdpartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationThirdpartyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationThirdpartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
