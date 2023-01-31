import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMenuDetailComponent } from './club-menu-detail.component';

describe('ClubMenuDetailComponent', () => {
  let component: ClubMenuDetailComponent;
  let fixture: ComponentFixture<ClubMenuDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubMenuDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMenuDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
