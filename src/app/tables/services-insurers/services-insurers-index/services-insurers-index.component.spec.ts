import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesInsurersIndexComponent } from './services-insurers-index.component';

describe('ServicesInsurersIndexComponent', () => {
  let component: ServicesInsurersIndexComponent;
  let fixture: ComponentFixture<ServicesInsurersIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesInsurersIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesInsurersIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
