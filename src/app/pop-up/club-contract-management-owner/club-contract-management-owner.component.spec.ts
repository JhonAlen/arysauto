import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubContractManagementOwnerComponent } from './club-contract-management-owner.component';

describe('ClubContractManagementOwnerComponent', () => {
  let component: ClubContractManagementOwnerComponent;
  let fixture: ComponentFixture<ClubContractManagementOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubContractManagementOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubContractManagementOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
