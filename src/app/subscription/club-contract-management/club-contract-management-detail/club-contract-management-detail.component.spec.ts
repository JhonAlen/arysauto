import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubContractManagementDetailComponent } from './club-contract-management-detail.component';

describe('ClubContractManagementDetailComponent', () => {
  let component: ClubContractManagementDetailComponent;
  let fixture: ComponentFixture<ClubContractManagementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubContractManagementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubContractManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
