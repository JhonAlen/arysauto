import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDepletionTypeDetailComponent } from './service-depletion-type-detail.component';

describe('DepletionTypeDetailComponent', () => {
  let component: ServiceDepletionTypeDetailComponent;
  let fixture: ComponentFixture<ServiceDepletionTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDepletionTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDepletionTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
