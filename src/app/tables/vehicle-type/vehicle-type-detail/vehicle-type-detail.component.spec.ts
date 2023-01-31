import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypeDetailComponent } from './vehicle-type-detail.component';

describe('VehicleTypeDetailComponent', () => {
  let component: VehicleTypeDetailComponent;
  let fixture: ComponentFixture<VehicleTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
