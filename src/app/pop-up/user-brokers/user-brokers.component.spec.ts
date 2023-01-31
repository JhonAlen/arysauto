import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBrokersComponent } from './user-brokers.component';

describe('UserBrokersComponent', () => {
  let component: UserBrokersComponent;
  let fixture: ComponentFixture<UserBrokersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBrokersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBrokersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
