import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionOrderFleetContractDetailComponent } from './collection-order-fleet-contract-detail.component';

describe('CollectionOrderFleetContractDetailComponent', () => {
  let component: CollectionOrderFleetContractDetailComponent;
  let fixture: ComponentFixture<CollectionOrderFleetContractDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionOrderFleetContractDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionOrderFleetContractDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
