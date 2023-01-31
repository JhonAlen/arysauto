import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationMaterialDamageComponent } from './notification-material-damage.component';

describe('NotificationMaterialDamageComponent', () => {
  let component: NotificationMaterialDamageComponent;
  let fixture: ComponentFixture<NotificationMaterialDamageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationMaterialDamageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMaterialDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
