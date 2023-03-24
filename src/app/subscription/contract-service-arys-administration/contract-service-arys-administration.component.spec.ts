import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractServiceArysAdministrationComponent } from './contract-service-arys-administration.component';

describe('ContractServiceArysAdministrationComponent', () => {
  let component: ContractServiceArysAdministrationComponent;
  let fixture: ComponentFixture<ContractServiceArysAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractServiceArysAdministrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractServiceArysAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
