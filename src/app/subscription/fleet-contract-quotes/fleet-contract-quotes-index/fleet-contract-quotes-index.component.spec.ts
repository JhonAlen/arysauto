import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractQuotesIndexComponent } from './fleet-contract-quotes-index.component';

describe('FleetContractQuotesIndexComponent', () => {
  let component: FleetContractQuotesIndexComponent;
  let fixture: ComponentFixture<FleetContractQuotesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractQuotesIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractQuotesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
