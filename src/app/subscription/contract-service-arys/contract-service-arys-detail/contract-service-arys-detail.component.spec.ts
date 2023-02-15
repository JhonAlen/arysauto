import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractServiceArysDetailComponent } from './contract-service-arys-detail.component';

describe('ContractServiceArysDetailComponent', () => {
  let component: ContractServiceArysDetailComponent;
  let fixture: ComponentFixture<ContractServiceArysDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractServiceArysDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractServiceArysDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
