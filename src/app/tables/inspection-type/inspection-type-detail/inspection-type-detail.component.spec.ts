import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTypeDetailComponent } from './inspection-type-detail.component';

describe('InspectionTypeDetailComponent', () => {
  let component: InspectionTypeDetailComponent;
  let fixture: ComponentFixture<InspectionTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
