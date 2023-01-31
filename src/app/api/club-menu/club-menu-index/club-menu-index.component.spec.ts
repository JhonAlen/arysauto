import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMenuIndexComponent } from './club-menu-index.component';

describe('ClubMenuIndexComponent', () => {
  let component: ClubMenuIndexComponent;
  let fixture: ComponentFixture<ClubMenuIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubMenuIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMenuIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
