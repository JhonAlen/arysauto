import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionOrderFleetContractIndexComponent } from './collection-order-fleet-contract-index.component';

describe('CollectionOrderFleetContractIndexComponent', () => {
  let component: CollectionOrderFleetContractIndexComponent;
  let fixture: ComponentFixture<CollectionOrderFleetContractIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionOrderFleetContractIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionOrderFleetContractIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
