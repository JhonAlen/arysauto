import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceIndexComponent } from './service-index.component';

describe('ServiceIndexComponent', () => {
  let component: ServiceIndexComponent;
  let fixture: ComponentFixture<ServiceIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
