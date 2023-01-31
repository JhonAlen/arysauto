import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMenuSubMenuComponent } from './club-menu-sub-menu.component';

describe('ClubMenuSubMenuComponent', () => {
  let component: ClubMenuSubMenuComponent;
  let fixture: ComponentFixture<ClubMenuSubMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubMenuSubMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMenuSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
