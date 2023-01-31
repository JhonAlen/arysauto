import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypeIndexComponent } from './vehicle-type-index.component';

describe('VehicleTypeIndexComponent', () => {
  let component: VehicleTypeIndexComponent;
  let fixture: ComponentFixture<VehicleTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
