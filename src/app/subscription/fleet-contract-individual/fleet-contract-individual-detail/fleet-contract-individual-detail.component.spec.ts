import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractIndividualDetailComponent } from './fleet-contract-individual-detail.component';

describe('FleetContractIndividualDetailComponent', () => {
  let component: FleetContractIndividualDetailComponent;
  let fixture: ComponentFixture<FleetContractIndividualDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractIndividualDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractIndividualDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
