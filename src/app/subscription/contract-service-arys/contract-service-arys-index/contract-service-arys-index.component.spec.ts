import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractServiceArysIndexComponent } from './contract-service-arys-index.component';

describe('ContractServiceArysIndexComponent', () => {
  let component: ContractServiceArysIndexComponent;
  let fixture: ComponentFixture<ContractServiceArysIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractServiceArysIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractServiceArysIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
