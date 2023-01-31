import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerVehicleComponent } from './owner-vehicle.component';

describe('OwnerVehicleComponent', () => {
  let component: OwnerVehicleComponent;
  let fixture: ComponentFixture<OwnerVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
