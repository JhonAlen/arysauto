import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeIndexComponent } from './service-type-index.component';

describe('ServiceTypeIndexComponent', () => {
  let component: ServiceTypeIndexComponent;
  let fixture: ComponentFixture<ServiceTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
