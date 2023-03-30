import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InclusionContractComponent } from './inclusion-contract.component';

describe('InclusionContractComponent', () => {
  let component: InclusionContractComponent;
  let fixture: ComponentFixture<InclusionContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InclusionContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InclusionContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
