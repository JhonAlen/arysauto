import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeDetailComponent } from './service-type-detail.component';

describe('ServiceTypeDetailComponent', () => {
  let component: ServiceTypeDetailComponent;
  let fixture: ComponentFixture<ServiceTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
