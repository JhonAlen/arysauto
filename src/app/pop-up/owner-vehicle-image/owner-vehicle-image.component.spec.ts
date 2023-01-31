import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerVehicleImageComponent } from './owner-vehicle-image.component';

describe('OwnerVehicleImageComponent', () => {
  let component: OwnerVehicleImageComponent;
  let fixture: ComponentFixture<OwnerVehicleImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerVehicleImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerVehicleImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
