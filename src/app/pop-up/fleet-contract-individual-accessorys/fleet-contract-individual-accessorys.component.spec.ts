import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractIndividualAccessorysComponent } from './fleet-contract-individual-accessorys.component';

describe('FleetContractIndividualAccessorysComponent', () => {
  let component: FleetContractIndividualAccessorysComponent;
  let fixture: ComponentFixture<FleetContractIndividualAccessorysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractIndividualAccessorysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractIndividualAccessorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
