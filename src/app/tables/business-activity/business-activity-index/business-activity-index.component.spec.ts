import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessActivityIndexComponent } from './business-activity-index.component';

describe('BusinessActivityIndexComponent', () => {
  let component: BusinessActivityIndexComponent;
  let fixture: ComponentFixture<BusinessActivityIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessActivityIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessActivityIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
