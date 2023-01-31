import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRoleMenuComponent } from './club-role-menu.component';

describe('ClubRoleMenuComponent', () => {
  let component: ClubRoleMenuComponent;
  let fixture: ComponentFixture<ClubRoleMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubRoleMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
