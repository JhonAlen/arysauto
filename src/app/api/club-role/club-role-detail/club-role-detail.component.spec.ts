import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRoleDetailComponent } from './club-role-detail.component';

describe('ClubRoleDetailComponent', () => {
  let component: ClubRoleDetailComponent;
  let fixture: ComponentFixture<ClubRoleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubRoleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRoleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
