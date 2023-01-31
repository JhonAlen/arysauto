import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessActivityDetailComponent } from './business-activity-detail.component';

describe('BusinessActivityDetailComponent', () => {
  let component: BusinessActivityDetailComponent;
  let fixture: ComponentFixture<BusinessActivityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessActivityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessActivityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
