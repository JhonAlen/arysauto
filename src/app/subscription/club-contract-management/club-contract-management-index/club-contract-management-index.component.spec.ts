import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubContractManagementIndexComponent } from './club-contract-management-index.component';

describe('ClubContractManagementIndexComponent', () => {
  let component: ClubContractManagementIndexComponent;
  let fixture: ComponentFixture<ClubContractManagementIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubContractManagementIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubContractManagementIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
