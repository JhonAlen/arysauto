import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraCoverageVehicleTypeComponent } from './extra-coverage-vehicle-type.component';

describe('ExtraCoverageVehicleTypeComponent', () => {
  let component: ExtraCoverageVehicleTypeComponent;
  let fixture: ComponentFixture<ExtraCoverageVehicleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraCoverageVehicleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraCoverageVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
