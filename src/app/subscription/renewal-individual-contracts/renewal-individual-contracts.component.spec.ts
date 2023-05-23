import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalIndividualContractsComponent } from './renewal-individual-contracts.component';

describe('RenewalIndividualContractsComponent', () => {
  let component: RenewalIndividualContractsComponent;
  let fixture: ComponentFixture<RenewalIndividualContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalIndividualContractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalIndividualContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
