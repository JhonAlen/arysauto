import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetLoadingComponent } from './fleet-loading.component';

describe('FleetLoadingComponent', () => {
  let component: FleetLoadingComponent;
  let fixture: ComponentFixture<FleetLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
