import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractQuotesDetailComponent } from './fleet-contract-quotes-detail.component';

describe('FleetContractQuotesDetailComponent', () => {
  let component: FleetContractQuotesDetailComponent;
  let fixture: ComponentFixture<FleetContractQuotesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractQuotesDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractQuotesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
