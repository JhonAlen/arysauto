import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderIndexComponent } from './service-order-index.component';

describe('ServiceOrderIndexComponent', () => {
  let component: ServiceOrderIndexComponent;
  let fixture: ComponentFixture<ServiceOrderIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
