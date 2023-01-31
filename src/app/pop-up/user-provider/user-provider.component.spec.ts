import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProviderComponent } from './user-provider.component';

describe('UserProviderComponent', () => {
  let component: UserProviderComponent;
  let fixture: ComponentFixture<UserProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
