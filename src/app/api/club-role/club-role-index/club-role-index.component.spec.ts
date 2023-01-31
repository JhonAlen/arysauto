import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRoleIndexComponent } from './club-role-index.component';

describe('ClubRoleIndexComponent', () => {
  let component: ClubRoleIndexComponent;
  let fixture: ComponentFixture<ClubRoleIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubRoleIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRoleIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
