import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDepletionTypeIndexComponent } from './service-depletion-type-index.component';

describe('ServiceDepletionTypeIndexComponent', () => {
  let component: ServiceDepletionTypeIndexComponent;
  let fixture: ComponentFixture<ServiceDepletionTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDepletionTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDepletionTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
