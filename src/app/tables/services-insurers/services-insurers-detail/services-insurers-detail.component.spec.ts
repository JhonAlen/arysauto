import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesInsurersDetailComponent } from './services-insurers-detail.component';

describe('ServicesInsurersDetailComponent', () => {
  let component: ServicesInsurersDetailComponent;
  let fixture: ComponentFixture<ServicesInsurersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesInsurersDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesInsurersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
